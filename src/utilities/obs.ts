import { workspace, Uri } from "vscode";

export const directoryExists = async (uri: Uri) => {
  try {
    await workspace.fs.readDirectory(uri);
    return true;
  } catch (error) {
    return false;
  }
};
