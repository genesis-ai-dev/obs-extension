import * as vscode from "vscode";

import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";
import { VIEW_TYPES } from "../types";
import { MessageType } from "../types";

export class ProjectManagerProvider implements vscode.WebviewViewProvider {
  private _webviewView: vscode.WebviewView | undefined;
  private _context: vscode.ExtensionContext | undefined;

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);

    const provider = new ProjectManagerProvider(context);
    const providerRegistration = vscode.window.registerWebviewViewProvider(
      ProjectManagerProvider.viewType,
      provider
    );

    item.show();
    return providerRegistration;
  }

  private static readonly viewType = VIEW_TYPES.PROJECT_MANAGER;

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    this._registerCommands();
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
    webviewPanel.webview.onDidReceiveMessage(
      async (message: { type: MessageType; payload?: unknown }) => {
        switch (message.type) {
          case MessageType.RENAME_PROJECT:
            vscode.commands.executeCommand("obs-extension.nameProject", true);
            break;
          case MessageType.CHANGE_USERNAME:
            vscode.commands.executeCommand("obs-extension.userName", true);
            break;
          case MessageType.CHANGE_SOURCE_LANG:
            vscode.commands.executeCommand("obs-extension.promptUserForSourceLanguage");
            break;
          case MessageType.CHANGE_TARGET_LANG:
            vscode.commands.executeCommand("obs-extension.promptUserForTargetLanguage");
            break;
          case MessageType.DOWNLOAD_SOURCE_OBS:
            vscode.commands.executeCommand("obs-extension.downloadSourceObs");
            break;
          case MessageType.CREATE_OBS_PROJECT:
            vscode.commands.executeCommand("obs-extension.startWalkthrough");
            break;
          default:
            console.error(`Unknown command: ${message.type}`);
            break;
        }
      }
    );

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
      "ProjectManagerView.js",
    ]);

    const codiconsUri = getUri(webview, extensionUri, [
      "node_modules",
      "@vscode/codicons",
      "dist",
      "codicon.css",
    ]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline '${webview.cspSource}; script-src 'nonce-${nonce}';"> -->
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <link href="${codiconsUri}" rel="stylesheet" />
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
