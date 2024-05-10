import { ExtensionContext } from "vscode";
import { ObsEditorProvider } from "./providers/ObsEditorProvider";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(ObsEditorProvider.register(context));
}
