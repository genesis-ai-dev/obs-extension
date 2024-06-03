import { window } from "vscode";
import { LanguageMetadata, LanguageProjectStatus, Project } from "codex-types";
import { LanguageCodes } from "./languageUtils";

export interface ProjectDetails {
  projectName?: string;
  description?: string;
  userName?: string;
  abbreviation?: string;
  sourceLanguage?: LanguageMetadata;
  targetLanguage?: LanguageMetadata;
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
