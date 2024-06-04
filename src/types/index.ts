export interface VerseRefGlobalState {
  verseRef: string;
  uri: string;
}

export interface SelectedTextDataWithContext {
  selection: string;
  completeLineContent: string | null;
  vrefAtStartOfLine: string | null;
  selectedText: string | null;
}

export type OBSRef = {
  storyId: string;
  paragraph: string;
};

export enum VIEW_TYPES {
  EDITOR = "obs-extension.editor",
  OBS_OUTLINE = "obs-extension.obs-outline",
  PROJECT_MANAGER = "obs-extension.project-manager",
}

export enum COMMAND_TYPE {
  INITIALIZE_NEW_PROJECT = "obs-extension.initializeNewProject",
  INITIALIZE_IMPORT_PROJECT = "obs-extension.initializeImportProject",
  NAME_PROJECT = "obs-extension.nameProject",
  CHANGE_USERNAME = "obs-extension.userName",
  OPEN_PROJECT_SETTINGS = "obs-extension.openProjectSettings",
  EDIT_PROJECT_SETTINGS = "obs-extension.editProjectSettings",
  START_WALKTHROUGH = "obs-extension.startWalkthrough",
  START_TRANSLATING = "obs-extension.startTranslating",
  PROMPT_TARGET = "obs-extension.promptUserForTargetLanguage",
  PROMPT_SOURCE = "obs-extension.promptUserForSourceLanguage",
  DOWNLOAD_SOURCE = "obs-extension.downloadSourceTextBibles",
  SET_TARGET_FONT = "obs-extension.setEditorFontToTargetLanguage",
  OPEN_STORY = "obs-extension.openStory",
}

export enum MessageType {
  SHOW_DIALOG = "showDialog",
  SAVE = "save",
  OPEN_STORY = "openStory",
  UPDATE_OBS_REF = "updateObsRef",
  RENAME_PROJECT = "renameProject",
  CHANGE_USERNAME = "changeUsername",
  CHANGE_SOURCE_LANG = "changeSourceLanguage",
  CHANGE_TARGET_LANG = "changeTargetLanguage",
  DOWNLOAD_SOURCE_OBS = "downloadSourceObs",
  CREATE_OBS_PROJECT = "createObsProject",
}

export type Language = {
  lc: string;
  code?: string;
  ld: string;
  alt: string[];
  hc: string;
  ln: string;
  ang: string;
  lr: string;
  pk: number;
  gw: boolean;
  cc: string[];
};

export type Copyright = {
  title: string;
  id: string;
  licence: string;
  locked: boolean;
};

export type DownloadedResource = {
  name: string;
  id: string;
  type: "obs" | "bible" | "tn" | "tw" | "ta" | "tq";
  localPath: string;
  remoteUrl: string;
  version: string;
  // uri: Record<string, any>;
};

export type ObsStory = Record<string, any>;

export type AnyObject = {
  [key: string]: any;
};