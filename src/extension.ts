import { ExtensionContext, Uri, ViewColumn, commands, workspace } from "vscode";
import { ObsEditorProvider } from "./providers/ObsEditorProvider";
import { StoryOutlineProvider } from "./providers/storyOutlineProvider";
import { ProjectManagerProvider } from "./providers/projectManagerProvider";
import { COMMAND_TYPE } from "./types";

export async function activate(context: ExtensionContext) {
  context.subscriptions.push(ObsEditorProvider.register(context));
  context.subscriptions.push(StoryOutlineProvider.register(context));
  context.subscriptions.push(ProjectManagerProvider.register(context));

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.DOWNLOAD_SOURCE, () => console.log("download"))
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.NAME_PROJECT, async (commandOnly: boolean = false) => {
      // TODO: Metadata stuff???

      if (!commandOnly) {
        const settingUri = Uri.file(workspace.getConfiguration().get("settings.json") || "");
        await commands.executeCommand("vscode.open", settingUri, {
          viewColumn: ViewColumn.Beside,
        });
      }

      await commands.executeCommand(
        "workbench.action.openWorkspaceSettings",
        "@ext:project-accelerate.obs-extension obs-extension.projectName"
      );
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.CHANGE_USERNAME, async (commandOnly: boolean = false) => {
      // TODO: Metadata stuff???

      if (!commandOnly) {
        const settingUri = Uri.file(workspace.getConfiguration().get("settings.json") || "");
        await commands.executeCommand("vscode.open", settingUri, {
          viewColumn: ViewColumn.Beside,
        });
      }

      await commands.executeCommand(
        "workbench.action.openWorkspaceSettings",
        "@ext:project-accelerate.obs-extension obs-extension.userName"
      );
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.INITIALIZE_NEW_PROJECT, async () => {
      // TODO: Create OBS SB files
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.INITIALIZE_IMPORT_PROJECT, async () => {
      // TODO: Create OBS SB files from import
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.PROMPT_TARGET, async () => {
      // TODO: Figure out how to change target language with OBS SB
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.PROMPT_SOURCE, async () => {
      // TODO: Figure out how to change source language with OBS SB
    })
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.OPEN_PROJECT_SETTINGS, () =>
      commands.executeCommand("workbench.action.openWorkspaceSettings", "obs-extension")
    )
  );

  context.subscriptions.push(
    commands.registerCommand(COMMAND_TYPE.START_TRANSLATING, async () => {
      commands.executeCommand("workbench.view.extension.stories-outline");
    })
  );

  // context.subscriptions.push(commands.registerCommand(COMMAND_TYPE., ));

  // TODO: Walkthrough commands
  // context.subscriptions.push(
  //   commands.registerCommand(COMMAND_TYPE.START_WALKTHROUGH, () => {
  //     commands.executeCommand(
  //       "workbench.action.openWalkthrough",
  //       {
  //         category: "project-accelerate.codex-project-manager#codexWalkthrough",
  //         step: "project-accelerate.codex-project-manager#openFolder",
  //       },
  //       true
  //     );
  //   })
  // );

  //   context.subscriptions.push(
  //     commands.registerCommand(COMMAND_TYPE.EDIT_PROJECT_SETTINGS, () => {
  //       commands.executeCommand(
  //         "workbench.action.openWalkthrough",
  //         {
  //           category: "project-accelerate.codex-project-manager#codexWalkthrough",
  //           step: "projectName",
  //         },
  //         true
  //       );
  //     })
  //   );
}
