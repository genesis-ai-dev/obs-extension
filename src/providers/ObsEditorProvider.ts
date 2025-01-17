import * as vscode from "vscode";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";
import { VIEW_TYPES } from "../types";
import { MessageType } from "../types";
import { initializeStateStore } from "../stateStore";

export class ObsEditorProvider implements vscode.CustomTextEditorProvider {
  private _webview: vscode.Webview | undefined;
  private _context: vscode.ExtensionContext | undefined;

  private globalState: Awaited<ReturnType<typeof initializeStateStore>> | undefined;

  static readonly viewType = VIEW_TYPES.EDITOR;

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new ObsEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      ObsEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;

    initializeStateStore().then((store) => {
      this.globalState = store;
    });
  }

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this._getWebviewContent(
      webviewPanel.webview,
      this.context.extensionUri
    );

    function updateWebview() {
      const docPath = document.uri.path;

      webviewPanel.webview.postMessage({
        type: "update",
        payload: {
          doc: document.getText(),
          isReadonly: docPath.includes(".project/resources"), // if the document is in the resources folder, it's readonly
        },
      });
    }

    webviewPanel.onDidChangeViewState((e) => {
      if (e.webviewPanel.active) {
        updateWebview();
      }
    });

    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview();
      }
    });

    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage(async (e: { type: MessageType; payload: unknown }) => {
      const { type, payload } = e;

      switch (type) {
        case MessageType.SHOW_DIALOG:
          vscode.window.showInformationMessage(e.payload as string);
          return;
        case MessageType.SAVE: {
          const edit = new vscode.WorkspaceEdit();
          edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            payload as string
          );
          vscode.workspace.applyEdit(edit);
          return;
        }
        case MessageType.UPDATE_OBS_REF: {
          if (!this.globalState) {
            await initializeStateStore().then((store) => {
              this.globalState = store;
            });
          }

          const storyId = document.fileName.split("/").pop()?.split(".")[0];

          if (!storyId) {
            throw new Error("Unable to get the story id from the document path");
          }
          this.globalState?.updateStoreState({
            key: "obsRef",
            value: {
              paragraph: (
                e.payload as {
                  paragraphId: number;
                }
              ).paragraphId.toString(),
              storyId: storyId,
            },
          });
          return;
        }
      }
    });

    this._webview = webviewPanel.webview;

    updateWebview();
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
      "ObsView.js",
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
          <title>OBS View</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }
}
