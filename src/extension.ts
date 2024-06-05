import {
  ExtensionContext,
  Uri,
  ViewColumn,
  ConfigurationTarget,
  commands,
  workspace,
  window,
} from "vscode";
import { ObsEditorProvider } from "./providers/ObsEditorProvider";
import { StoryOutlineProvider } from "./providers/storyOutlineProvider";
import { ProjectManagerProvider } from "./providers/projectManagerProvider";
import { COMMAND_TYPE, Meta } from "./types";
import type { ProjectDetails } from "./utilities/projectUtils";
import {
  promptForTargetLanguage,
  promptForSourceLanguage,
  promptForObsSource,
} from "./utilities/projectUtils";
import { createObsProject } from "./utilities/createObsProject";
import { downloadResource } from "./utilities/download";
import { VIEW_TYPES } from "./types";
import { fetchResource } from "./utilities/fetchResources";

async function updateProjectSettings(projectDetails: ProjectDetails) {
  const projectSettings = workspace.getConfiguration("obs-extension");
  if (projectDetails.projectName) {
    await projectSettings.update(
      "projectName",
      projectDetails.projectName,
      ConfigurationTarget.Workspace
    );
  }
  if (projectDetails.description) {
    await projectSettings.update(
      "description",
      projectDetails.description,
      ConfigurationTarget.Workspace
    );
  }
  if (projectDetails.userName) {
    await projectSettings.update(
      "userName",
      projectDetails.userName,
      ConfigurationTarget.Workspace
    );
  }
  if (projectDetails.abbreviation) {
    await projectSettings.update(
      "abbreviation",
      projectDetails.abbreviation,
      ConfigurationTarget.Workspace
    );
  }
  if (projectDetails.sourceLanguage) {
    await projectSettings.update(
      "sourceLanguage",
      projectDetails.sourceLanguage,
      ConfigurationTarget.Workspace
    );
  }
  if (projectDetails.targetLanguage) {
    await projectSettings.update(
      "targetLanguage",
      projectDetails.targetLanguage,
      ConfigurationTarget.Workspace
    );
  }
  if (projectDetails.obsSource) {
    await projectSettings.update(
      "obsSource",
      projectDetails.obsSource,
      ConfigurationTarget.Workspace
    );
  }
}

export async function activate(context: ExtensionContext) {
  const downloadableObsList: Meta[] = await fetchResource(false, [], [], "obs");

  context.subscriptions.push(ObsEditorProvider.register(context));
  context.subscriptions.push(StoryOutlineProvider.register(context));
  context.subscriptions.push(ProjectManagerProvider.register(context));

  context.subscriptions.push(
    workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("obs-extension")) {
        // TODO: UPDATE METADATA FILE
      }
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.NAME_PROJECT, async (commandOnly: boolean = false) => {
      // TODO: Metadata stuff???

      if (!commandOnly) {
        const settingUri = Uri.file(workspace.getConfiguration().get("settings.json") || "");
        await commands.executeCommand("vscode.open", settingUri, {
          viewColumn: ViewColumn.Beside,
        });
      }

      await commands.executeCommand(
        "workbench.action.openWorkspaceSettings",
        "@ext:project-accelerate.obs-extension obs-extension.projectName"
      );
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.CHANGE_USERNAME, async (commandOnly: boolean = false) => {
      // TODO: Metadata stuff???

      if (!commandOnly) {
        const settingUri = Uri.file(workspace.getConfiguration().get("settings.json") || "");
        await commands.executeCommand("vscode.open", settingUri, {
          viewColumn: ViewColumn.Beside,
        });
      }

      await commands.executeCommand(
        "workbench.action.openWorkspaceSettings",
        "@ext:project-accelerate.obs-extension obs-extension.userName"
      );
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.INITIALIZE_NEW_PROJECT, async () => {
      let config = workspace.getConfiguration();

      createObsProject({
        projectName: config.get("obs-extension.projectName", ""),
        description: config.get("obs-extension.description", ""),
        abbreviation: config.get("obs-extension.abbreviation", ""),
        targetLanguage: config.get("obs-extension.targetLanguage", { tag: "", name: { "": "" } }),
        username: config.get("obs-extension.username", ""),
        email: "",
        name: "",
        copyright: {},
      });
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.INITIALIZE_IMPORT_PROJECT, async () => {
      // TODO: Create OBS SB files from import
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.PROMPT_TARGET, async () => {
      const config = workspace.getConfiguration();
      const existingTargetLanguage = config.get("obs-extension.targetLanguage") as any;
      console.log("existingTargetLanguage", existingTargetLanguage);
      if (existingTargetLanguage) {
        const overwrite = await window.showWarningMessage(
          `The target language is already set to ${existingTargetLanguage.refName}. Do you want to overwrite it?`,
          "Yes",
          "No"
        );
        if (overwrite === "Yes") {
          const projectDetails = await promptForTargetLanguage();
          const targetLanguage = projectDetails?.targetLanguage;
          if (targetLanguage) {
            await updateProjectSettings(projectDetails);
            window.showInformationMessage(`Target language updated to ${targetLanguage.refName}.`);
          }
        } else {
          window.showInformationMessage("Target language update cancelled.");
        }
      } else {
        const projectDetails = await promptForTargetLanguage();
        const targetLanguage = projectDetails?.targetLanguage;
        if (targetLanguage) {
          await updateProjectSettings(projectDetails);
          window.showInformationMessage(`Target language set to ${targetLanguage.refName}.`);
        }
      }
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.PROMPT_SOURCE, async () => {
      try {
        const projectDetails = await promptForSourceLanguage();
        const sourceLanguage = projectDetails?.sourceLanguage;
        console.log("sourceLanguage", sourceLanguage);
        if (sourceLanguage) {
          await updateProjectSettings(projectDetails);
          window.showInformationMessage(`Source language set to ${sourceLanguage.refName}.`);
        }
      } catch (error) {
        window.showErrorMessage(`Failed to set source language: ${error}`);
      }
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.DOWNLOAD_SOURCE, async () => {
      const config = workspace.getConfiguration();
      const existingObsSource = config.get("obs-extension.obsSource") as any;

      try {
        if (existingObsSource) {
          const overwrite = await window.showWarningMessage(
            `The OBS Source files are already set to ${existingObsSource.language_title} (${existingObsSource.language}). Do you want to overwrite them?`,
            "Yes",
            "No"
          );
          if (overwrite === "Yes") {
            const projectDetails = await promptForObsSource(downloadableObsList);
            const obsSource = projectDetails?.obsSource;
            if (obsSource) {
              await updateProjectSettings(projectDetails);
              window.showInformationMessage(
                `OBS source files updated to ${obsSource.language_title} (${obsSource.language}).`
              );
              await downloadResource(obsSource);
            }
          } else {
            window.showInformationMessage("OBS source files update cancelled.");
          }
        } else {
          const projectDetails = await promptForObsSource(downloadableObsList);
          const obsSource = projectDetails?.obsSource;
          if (obsSource) {
            await updateProjectSettings(projectDetails);
            window.showInformationMessage(
              `OBS source files set to ${obsSource.language_title} (${obsSource.language}).`
            );
            await downloadResource(obsSource);
          }
        }
      } catch (error) {
        window.showErrorMessage(`Failed to download Source OBS: ${error}`);
      }
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.OPEN_PROJECT_SETTINGS, () =>
      commands.executeCommand("workbench.action.openWorkspaceSettings", "obs-extension")
    )
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.START_TRANSLATING, async () => {
      commands.executeCommand("workbench.view.extension.stories-outline");
      commands.executeCommand(COMMAND_TYPE.OPEN_STORY, "01");
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.START_WALKTHROUGH, () => {
      commands.executeCommand(
        "workbench.action.openWalkthrough",
        {
          category: "project-accelerate.obs-extension#obsWalkthrough",
          step: "project-accelerate.obs-extension#openFolder",
        },
        true
      );
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.EDIT_PROJECT_SETTINGS, () => {
      commands.executeCommand(
        "workbench.action.openWalkthrough",
        {
          category: "project-accelerate.obs-extension#obsWalkthrough",
          step: "projectName",
        },
        true
      );
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.OPEN_STORY, async (storyNumber: Number) => {
      try {
        // Open ObsEditor Panel on Left
        const editableStoryURI = Uri.joinPath(
          workspace?.workspaceFolders?.[0].uri as Uri,
          "ingredients",
          `${storyNumber}.md`
        );

        await commands.executeCommand("vscode.openWith", editableStoryURI, VIEW_TYPES.EDITOR, {
          preserveFocus: true,
          preview: false,
          viewColumn: ViewColumn.One,
        });

        const readOnlyStoryURI = Uri.joinPath(
          workspace?.workspaceFolders?.[0].uri as Uri,
          ".project",
          "resources",
          "obs",
          "content",
          `${storyNumber}.md`
        );

        // Open ObsReadOnly Panel on right
        await commands.executeCommand("vscode.openWith", readOnlyStoryURI, VIEW_TYPES.EDITOR, {
          preserveFocus: false,
          preview: false,
          viewColumn: ViewColumn.Two,
        });
      } catch (error) {
        window.showErrorMessage(`Failed to set Open OBS Story ${storyNumber}: ${error}`);
      }
    })
  );
}
