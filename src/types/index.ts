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
  DOWNLOAD_SOURCE = "obs-extension.downloadSourceOBS",
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

export interface Meta {
  id: number;
  url: string;
  name: string;
  owner: string;
  full_name: string;
  repo: Repo;
  release: Release;
  tarbar_url: string;
  zipball_url: string;
  git_trees_url: string;
  contents_url: string;
  language: string;
  language_title: string;
  language_direction: string;
  language_is_gl: boolean;
  subject: string;
  flavor_type: string;
  flavor: string;
  abbreviation: string;
  title: string;
  branch_or_tag_name: string;
  ref_type: string;
  commit_sha: string;
  stage: string;
  metadata_url: string;
  metadata_json_url: string;
  metadata_api_contents_url: string;
  metadata_type: string;
  metadata_version: string;
  content_format: string;
  released: string;
  ingredients: Ingredient3[];
  books: string[];
  is_valid: boolean;
  validation_errors_url: string;
  isDownloaded: boolean;
  isChecked: boolean;
}

export interface Ingredient3 {
  categories: string[];
  identifier: string;
  path: string;
  sort: number;
  title: string;
  versification: string;
}

export interface Repo {
  id: number;
  owner: Owner;
  name: string;
  full_name: string;
  description: string;
  empty: boolean;
  private: boolean;
  fork: boolean;
  template: boolean;
  parent: any;
  mirror: boolean;
  size: number;
  languages_url: string;
  html_url: string;
  url: string;
  link: string;
  ssh_url: string;
  clone_url: string;
  original_url: string;
  website: string;
  stars_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  open_pr_counter: number;
  release_counter: number;
  default_branch: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  archived_at: string;
  permissions: Permissions;
  has_issues: boolean;
  internal_tracker: InternalTracker;
  has_wiki: boolean;
  has_pull_requests: boolean;
  has_projects: boolean;
  has_releases: boolean;
  has_packages: boolean;
  has_actions: boolean;
  ignore_whitespace_conflicts: boolean;
  allow_merge_commits: boolean;
  allow_rebase: boolean;
  allow_rebase_explicit: boolean;
  allow_squash_merge: boolean;
  allow_rebase_update: boolean;
  default_delete_branch_after_merge: boolean;
  default_merge_style: string;
  default_allow_maintainer_edit: boolean;
  avatar_url: string;
  internal: boolean;
  mirror_interval: string;
  mirror_updated: string;
  repo_transfer: any;
  metadata_type: string;
  metadata_version: string;
  language: string;
  language_title: string;
  language_direction: string;
  language_is_gl: boolean;
  subject: string;
  flavor_type: string;
  flavor: string;
  abbreviation: string;
  title: string;
  ingredients: Ingredient[];
  checking_level: number;
  catalog: Catalog;
  content_format: string;
}

export interface InternalTracker {
  enable_time_tracker: boolean;
  allow_only_contributors_to_track_time: boolean;
  enable_issue_dependencies: boolean;
}

export interface Ingredient {
  categories: string[];
  identifier: string;
  path: string;
  sort: number;
  title: string;
  versification: string;
}

export interface Ingredient2 {
  categories: string[];
  identifier: string;
  path: string;
  sort: number;
  title: string;
  versification: string;
}

export interface Ingredient3 {
  categories: string[];
  identifier: string;
  path: string;
  sort: number;
  title: string;
  versification: string;
}

export interface Prod {
  branch_or_tag_name: string;
  release_url: string;
  commit_sha: string;
  released: string;
  zipball_url: string;
  tarball_url: string;
  git_trees_url: string;
  contents_url: string;
}

export interface Latest {
  branch_or_tag_name: string;
  release_url: any;
  commit_sha: string;
  released: string;
  zipball_url: string;
  tarball_url: string;
  git_trees_url: string;
  contents_url: string;
}

export interface Catalog {
  prod: Prod;
  preprod: any;
  latest: Latest;
}

export interface Owner {
  id: number;
  login: string;
  login_name: string;
  full_name: string;
  email: string;
  avatar_url: string;
  language: string;
  is_admin: boolean;
  last_login: string;
  created: string;
  repo_languages: string[];
  repo_subjects: string[];
  repo_metadata_types: string[];
  restricted: boolean;
  active: boolean;
  prohibit_login: boolean;
  location: string;
  website: string;
  description: string;
  visibility: string;
  followers_count: number;
  following_count: number;
  starred_repos_count: number;
  username: string;
}

export interface Release {
  id: number;
  tag_name: string;
  target_commitish: string;
  name: string;
  body: string;
  url: string;
  html_url: string;
  tarball_url: string;
  zipball_url: string;
  upload_url: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  author: Author;
  assets: any[];
  door43_metadata: Door43Metadata;
}

export interface Author {
  id: number;
  login: string;
  login_name: string;
  full_name: string;
  email: string;
  avatar_url: string;
  language: string;
  is_admin: boolean;
  last_login: string;
  created: string;
  repo_languages: string[];
  repo_subjects: string[];
  repo_metadata_types: string[];
  restricted: boolean;
  active: boolean;
  prohibit_login: boolean;
  location: string;
  website: string;
  description: string;
  visibility: string;
  followers_count: number;
  following_count: number;
  starred_repos_count: number;
  username: string;
}

export interface Door43Metadata {
  id: number;
  url: string;
  name: string;
  owner: string;
  full_name: string;
  tarbar_url: string;
  zipball_url: string;
  git_trees_url: string;
  contents_url: string;
  language: string;
  language_title: string;
  language_direction: string;
  language_is_gl: boolean;
  subject: string;
  flavor_type: string;
  flavor: string;
  abbreviation: string;
  title: string;
  branch_or_tag_name: string;
  ref_type: string;
  commit_sha: string;
  stage: string;
  metadata_url: string;
  metadata_json_url: string;
  metadata_api_contents_url: string;
  metadata_type: string;
  metadata_version: string;
  content_format: string;
  released: string;
  ingredients: Ingredient2[];
  books: string[];
  is_valid: boolean;
  validation_errors_url: string;
}