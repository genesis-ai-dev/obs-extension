import { window } from "vscode";
import { LanguageMetadata, LanguageProjectStatus } from "codex-types";
import { LanguageCodes } from "./languageUtils";
import { Meta } from "../types";

export interface ProjectDetails {
  projectName?: string;
  description?: string;
  userName?: string;
  abbreviation?: string;
  sourceLanguage?: LanguageMetadata;
  targetLanguage?: LanguageMetadata;
  obsSource?: DCSResource;
}

export interface DCSResource {
  language_title: string;
  language: string;
}

export async function promptForTargetLanguage(): Promise<ProjectDetails | undefined> {
  const languages = LanguageCodes;

  function getLanguageDisplayName(lang: LanguageMetadata): string {
    return `${lang.refName} (${lang.tag})`;
  }

  const targetLanguagePick = await window.showQuickPick(languages.map(getLanguageDisplayName), {
    placeHolder: "Select the target language",
  });
  if (!targetLanguagePick) {
    return;
  }

  const targetLanguage = languages.find(
    (lang: LanguageMetadata) => getLanguageDisplayName(lang) === targetLanguagePick
  );
  if (!targetLanguage) {
    return;
  }

  // Add project status to the selected languages
  targetLanguage.projectStatus = LanguageProjectStatus.TARGET;

  return {
    targetLanguage,
  };
}

export async function promptForSourceLanguage(): Promise<ProjectDetails | undefined> {
  const languages = LanguageCodes;
  const sourceLanguagePick = await window.showQuickPick(
    languages.map((lang: LanguageMetadata) => `${lang.refName} (${lang.tag})`),
    {
      placeHolder: "Select the source language",
    }
  );
  if (!sourceLanguagePick) {
    return;
  }

  const sourceLanguage = languages.find(
    (lang: LanguageMetadata) => `${lang.refName} (${lang.tag})` === sourceLanguagePick
  );
  if (!sourceLanguage) {
    return;
  }

  // Add project status to the selected languages
  sourceLanguage.projectStatus = LanguageProjectStatus.SOURCE;

  return {
    // projectName,
    // projectCategory,
    // userName,
    // abbreviation,
    sourceLanguage,
  };
}

export const promptForObsSource = async (resources: Meta[]) => {
  const resourceDownloadPick = await window.showQuickPick(
    resources.map((resource: Meta) => `${resource.language_title} (${resource.language})`),
    {
      placeHolder: "Select the source language",
    }
  );

  if (!resourceDownloadPick) {
    return;
  }

  const resourceToDownload = resources.find(
    (resource: DCSResource) =>
      `${resource.language_title} (${resource.language})` === resourceDownloadPick
  );
  if (!resourceToDownload) {
    return;
  }
  return { obsSource: resourceToDownload };
};
