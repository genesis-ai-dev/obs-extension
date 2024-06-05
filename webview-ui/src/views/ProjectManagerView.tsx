import AccountButton from "../components/AccountButton";
import { MessageType } from "../../../src/types";
import { renderToPage } from "../utilities/main-vscode";
import { vscode } from "../utilities/vscode";

function ProjectManagerView() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        height: "100vh",
      }}>
      <i
        className="codicon codicon-tools"
        style={{
          fontSize: "500%",
          color: "var(--button-primary-background)",
        }}></i>
      <hr
        style={{
          marginBottom: "5vh",
          width: "100%",
          border: "1px solid var(--button-primary-background)",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          padding: "0 2rem",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            width: "100%",
          }}>
          <AccountButton
            iconClass="codicon-whole-word"
            onClick={() =>
              vscode.postMessage({
                type: MessageType.RENAME_PROJECT,
              })
            }
            buttonDescriptionText="Rename Project"
          />
          <AccountButton
            iconClass="codicon-account"
            onClick={() =>
              vscode.postMessage({
                type: MessageType.CHANGE_USERNAME,
              })
            }
            buttonDescriptionText="Change User Name"
          />
          <AccountButton
            iconClass="codicon-source-control"
            onClick={() =>
              vscode.postMessage({
                type: MessageType.CHANGE_SOURCE_LANG,
              })
            }
            buttonDescriptionText="Change Source Language"
          />
          <AccountButton
            iconClass="codicon-globe"
            onClick={() =>
              vscode.postMessage({
                type: MessageType.CHANGE_TARGET_LANG,
              })
            }
            buttonDescriptionText="Change Target Language"
          />
          <AccountButton
            iconClass="codicon-cloud-download"
            onClick={() =>
              vscode.postMessage({
                type: MessageType.DOWNLOAD_SOURCE_OBS,
              })
            }
            buttonDescriptionText="Download Source OBS"
            buttonIcon="codicon-arrow-down"
          />
        </div>

        <AccountButton
          iconClass="codicon-book"
          onClick={() =>
            vscode.postMessage({
              type: MessageType.CREATE_OBS_PROJECT,
            })
          }
          buttonDescriptionText="Create New Project"
          buttonIcon="codicon-plus"
          outerContainerStyles={{
            paddingTop: "10vh",
          }}
        />
      </div>
    </div>
  );
}

renderToPage(<ProjectManagerView />);
