import { ExtensionContext } from "vscode";
import { ObsEditorProvider } from "./providers/ObsEditorProvider";
import { StoryOutlineProvider } from "./providers/storyOutlineProvider";
import { ProjectManagerProvider } from "./providers/projectManagerProvider";

export function activate(context: ExtensionContext) {
  context.subscriptions.push(ObsEditorProvider.register(context));
  context.subscriptions.push(StoryOutlineProvider.register(context));
  context.subscriptions.push(ProjectManagerProvider.register(context));
}
