import { LanguageMetadata } from "codex-types";
import { saveObsProjectMeta } from "./saveObsProjectMeta";
import * as vscode from "vscode";

export type ProjectFields = {
  projectName?: string;
  description?: string;
  abbreviation?: string;
  targetLanguage?: LanguageMetadata;
  username?: string;
  email?: string;
  name?: string;
  copyright?: object;
};

export const createObsProject = async (projectFields: ProjectFields) => {
  const newProjectData = {
    newProjectFields: {
      projectName: projectFields.projectName || "",
      description: projectFields.description || "",
      abbreviation: projectFields.abbreviation || "",
    },
    language: projectFields.targetLanguage,
    copyright: projectFields.copyright || {},
    importedFiles: [],
    call: "new",
    update: false,
    projectType: "OBS",
    username: projectFields.username || "",
  };

  const res = await saveObsProjectMeta(newProjectData);

  if (!res) {
    vscode.window.showErrorMessage("Project creation failed");
    return;
  }

  vscode.window.showInformationMessage(
    `Project files have been created successfully at ${res.createdProjectURI}!`
  );
  return res;
};
