import * as vscode from "vscode";

import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";
import { VIEW_TYPES, COMMAND_TYPE, MessageType } from "../types";
import { initializeStateStore } from "../stateStore";

/**
 * Extension provider that is responsible for opening both the editable
 * and ReadOnly versions of OBS.
 *
 * Editable: OBS Custom Editor Extension
 * ReadOnly: OBSResource Provider
 *
 * These are both opened when the openStory message is received from the
 * StoryOutline webview
 */
export class StoryOutlineProvider implements vscode.WebviewViewProvider {
  private _webviewView: vscode.WebviewView | undefined;
  private _context: vscode.ExtensionContext | undefined;
  private stateStore: Awaited<ReturnType<typeof initializeStateStore>> | undefined;

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new StoryOutlineProvider(context);
    const providerRegistration = vscode.window.registerWebviewViewProvider(
      StoryOutlineProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = VIEW_TYPES.OBS_OUTLINE;

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    this._registerCommands();
    initializeStateStore().then((stateStore) => {
      this.stateStore = stateStore;
    });
  }

  public async resolveWebviewView(
    webviewPanel: vscode.WebviewView,
    ctx: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this._getWebviewContent(
      webviewPanel.webview,
      this.context.extensionUri
    );

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage(async (e: { type: MessageType; payload: unknown }) => {
      switch (e.type) {
        case MessageType.OPEN_STORY: {
          if (!vscode.workspace.workspaceFolders?.length) {
            console.error("No workspace opened");
            return;
          }

          const storyNumber = (e.payload as Record<string, any>).storyNumber;

          if (!storyNumber) {
            console.error("No story number provided");
            return;
          }

          // Open OBS Panels
          vscode.commands.executeCommand(COMMAND_TYPE.OPEN_STORY, storyNumber);

          await this._context?.workspaceState?.update("currentStoryId", storyNumber);

          if (!this.stateStore) {
            this.stateStore = await initializeStateStore();
          }

          this.stateStore?.updateStoreState({
            key: "obsRef",
            value: {
              storyId: storyNumber,
              paragraph: "1",
            },
          });
          break;
        }
        default:
          break;
      }
    });

    this._webviewView = webviewPanel;
  }

  public revive(panel: vscode.WebviewView) {
    this._webviewView = panel;
  }

  private async _registerCommands() {
    const commands: {
      command: string;
      title: string;
      handler: (...args: any[]) => any;
    }[] = [];

    const registeredCommands = await vscode.commands.getCommands();

    commands.forEach((command) => {
      if (!registeredCommands.includes(command.command)) {
        this._context?.subscriptions.push(
          vscode.commands.registerCommand(command.command, command.handler)
        );
      }
    });
  }

  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
    // The View JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "views",
      "StoriesOutline.js",
    ]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"> -->
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Sidebar Vscode Obs Extension</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }
}
