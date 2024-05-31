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
  EDITOR = "codex.obs.editor",
  OBS_OUTLINE = "scribe-vsc.obs-outline",
  PROJECT_MANAGER = "codex.obs.project-manager",
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
