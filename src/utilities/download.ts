import moment from "moment";
import path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
import JSZip from "jszip";
import md5 from "md5";
import type { AnyObject } from "../types";
import { createDownloadedResourceSB } from "./createDownloadedResourceSB";
import { directoryExists, fileExists } from "./obs";
import { generateObsResourceIngredients } from "./resourceIngredients";
import { generateAgSettings } from "./generateAgSettings";
import { environment } from "../data/environment";
import { Meta } from "../types";
import { getResourceType } from "./getResourceType";
// import { downloadSBTranslationResources } from "./downloadSBTranslationResources";
// import { getLinkedTwResource, getResourceType } from "../utilities";
const OBSLicense = fs.readFileSync(path.join(__dirname, "../data/OBSLicense.md"), "utf8");

type Resource = Meta;

export const downloadResource = async (resource: Resource) => {
  try {
    vscode.window.showInformationMessage("Download started, please wait...");

    const selectResource = getResourceType(resource.subject);
    if (!resource) {
      throw new Error("No resource given found");
    }

    // create the .project/resources folder if it does not exist
    const currentFolderURI = vscode.workspace.workspaceFolders?.[0].uri;
    if (!currentFolderURI) {
      throw new Error("No workspace opened");
    }
    const resourcesFolder = vscode.Uri.joinPath(currentFolderURI, ".project", "resources", "obs");
    const resourcesFolderExists = await directoryExists(resourcesFolder);
    if (!resourcesFolderExists) {
      await vscode.workspace.fs.createDirectory(resourcesFolder);
    }

    // TODO: IMPLEMENT OBS TRANSLATION HELPS
    // if (!["bible", "obs"].includes(selectResource)) {
    //   const results = await downloadSBTranslationResources({
    //     projectResource: resource,
    //     resourcesFolder,
    //   });

    //   if (selectResource === "obs-twl") {
    //     const linkedResource = await getLinkedTwResource(results?.resourceMeta);

    //     if (!linkedResource) {
    //       await vscode.workspace.fs.delete(results.folder);

    //       await vscode.window.showErrorMessage(
    //         "No linked Translation Words resource found! unable to download the resource!"
    //       );
    //       throw new Error(
    //         "No linked Translation Words resource found! unable to download the resource!"
    //       );
    //     }

    //     const linkedResourceResults = await downloadSBTranslationResources({
    //       projectResource: linkedResource,
    //       resourcesFolder,
    //     });

    //     return [
    //       {
    //         resource: linkedResourceResults?.resourceMeta?.meta,
    //         folder: linkedResourceResults?.folder,
    //         resourceType: "tw",
    //       },
    //       {
    //         resource: results?.resourceMeta?.meta,
    //         folder: results?.folder,
    //         resourceType: selectResource,
    //       },
    //     ];
    //   }

    //   return {
    //     resource,
    //     folder: results?.folder,
    //     resourceType: selectResource,
    //   };
    // }

    // create the resource burrito file
    const resourceMetadataRequest = await fetch(resource.metadata_json_url);
    const resourceMetadata = (await resourceMetadataRequest.json()) as AnyObject;
    const resourceBurritoFile = createDownloadedResourceSB({
      resourceMetadata,
      resource: resource as AnyObject,
      username: "test",
    });
    resourceBurritoFile.resourceMeta = resource;
    resourceBurritoFile.resourceMeta.lastUpdatedAg = moment().format();
    const currentProjectName = `${resource.name}_${
      Object.keys(resourceBurritoFile.identification.primary.scribe)[0]
    }`;

    // Download the zip of the resource
    const zipResponse = await fetch(resource.zipball_url);
    const zipBuffer = await zipResponse.arrayBuffer();
    await vscode.workspace.fs.writeFile(
      vscode.Uri.joinPath(resourcesFolder, `${currentProjectName}.zip`),
      Buffer.from(zipBuffer)
    );

    // unzip the resource
    const contents = await JSZip.loadAsync(zipBuffer);
    const zipKeys = Object.keys(contents.files);
    let licenseFileFound = false;

    // Get the root folder name
    const rootFolderName = zipKeys[0].split("/")[0];

    for (const key of zipKeys) {
      const item = contents.files[key];
      // Remove the root folder name from the path
      const relativePath = key.replace(`${rootFolderName}/`, "");

      if (item.dir) {
        await vscode.workspace.fs.createDirectory(
          vscode.Uri.joinPath(resourcesFolder, relativePath)
        );
      } else {
        const bufferContent = Buffer.from(await item.async("arraybuffer"));
        // save the resource to the local disk in the current project folder named .project/resources
        await vscode.workspace.fs.writeFile(
          vscode.Uri.joinPath(resourcesFolder, relativePath),
          bufferContent
        );
      }

      if (relativePath.toLowerCase().includes("license")) {
        licenseFileFound = true;
        if (await fileExists(vscode.Uri.joinPath(resourcesFolder, relativePath))) {
          const licenseContent = await vscode.workspace.fs.readFile(
            vscode.Uri.joinPath(resourcesFolder, relativePath)
          );
          const checksum = md5(licenseContent);
          const stats = await vscode.workspace.fs.stat(
            vscode.Uri.joinPath(resourcesFolder, relativePath)
          );
          resourceBurritoFile.ingredients[relativePath.replace(resource.name, ".")] = {
            checksum: { md5: checksum },
            mimeType: "text/md",
            size: stats.size,
            role: "x-licence",
          };
        }
      }
    }

    let finalBurritoFile = { ...resourceBurritoFile };
    let customLicenseContent = "";
    finalBurritoFile = await generateObsResourceIngredients({
      resource,
      resourceMetadata,
      folder: resourcesFolder,
      resourceBurrito: resourceBurritoFile,
      files: zipKeys,
    });
    customLicenseContent = OBSLicense;

    if (!licenseFileFound) {
      if (await directoryExists(resourcesFolder)) {
        const mdUri = vscode.Uri.joinPath(resourcesFolder, "LICENSE.md");
        await vscode.workspace.fs.writeFile(mdUri, Buffer.from(customLicenseContent));
        const stats = await vscode.workspace.fs.stat(mdUri);
        finalBurritoFile.ingredients["./LICENSE.md"] = {
          checksum: { md5: md5(customLicenseContent) },
          mimeType: "text/md",
          size: stats.size,
          role: "x-licence",
        };
      }
    }

    const settings = generateAgSettings({
      resourceMetadata,
      resourceBurrito: finalBurritoFile,
    });

    const settingsUri = vscode.Uri.joinPath(resourcesFolder, environment.PROJECT_SETTING_FILE);

    await vscode.workspace.fs.writeFile(settingsUri, Buffer.from(JSON.stringify(settings)));

    const checksum = md5(JSON.stringify(settings));

    const settingsStats = await vscode.workspace.fs.stat(settingsUri);

    finalBurritoFile.ingredients["./scribe-settings.json"] = {
      checksum: { md5: checksum },
      mimeType: "application/json",
      size: settingsStats.size,
      role: "x-scribe",
    };
    // added new section to avoid ingredients issue in meta some times (new user)
    const ymlPath = resourceMetadata?.projects[0]?.path.replace("./", "");
    const renames = Object.keys(finalBurritoFile.ingredients);
    const regex = new RegExp(`(\\.\\/)|(${ymlPath}[\\/\\\\])`, "g");
    renames?.forEach((rename) => {
      if (!rename.match(regex)) {
        delete finalBurritoFile.ingredients[rename];
      }
    });

    const metadataUri = vscode.Uri.joinPath(resourcesFolder, "metadata.json");

    await vscode.workspace.fs.writeFile(metadataUri, Buffer.from(JSON.stringify(finalBurritoFile)));

    // delete the downloaded zip file

    await vscode.workspace.fs.delete(
      vscode.Uri.joinPath(resourcesFolder, `${currentProjectName}.zip`)
    );

    vscode.window.showInformationMessage(`Resource ${resource.name} downloaded successfully`);
    // add to the global store of resources

    // return the local path to the resource
    return {
      resourceBurritoFile: finalBurritoFile,
      resourceMetadata,
      resource,
      folder: resourcesFolder,
      resourceType: selectResource,
    };
  } catch (error: any) {
    vscode.window.showErrorMessage(`Resource download failed ${error}`);
  }
};
