import { LanguageMetadata, LanguageProjectStatus, Project } from "codex-types";

export interface ProjectDetails {
  projectName?: string;
  description?: string;
  userName?: string;
  abbreviation?: string;
  sourceLanguage?: LanguageMetadata;
  targetLanguage?: LanguageMetadata;
}
