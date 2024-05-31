import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

interface AccountButtonProps {
  iconClass: string;
  onClick: () => void;
  buttonDescriptionText: string;
  buttonIcon?: string;
  outerContainerStyles?: React.CSSProperties;
}

const AccountButton: React.FC<AccountButtonProps> = ({
  iconClass,
  onClick,
  buttonDescriptionText,
  buttonIcon = "codicon-pencil",
  outerContainerStyles = {},
}) => {
  return (
    <div
      style={{
        width: "100%",
        marginBottom: "1rem",
        ...outerContainerStyles,
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          alignItems: "center",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
          }}>
          <i
            className={`codicon ${iconClass}`}
            style={{
              fontSize: "200%",
              padding: "0.5rem 0",
              color: "var(--button-primary-hover-background)",
              height: "max-content",
            }}></i>
          <p>{buttonDescriptionText}</p>
        </div>

        <VSCodeButton
          onClick={onClick}
          style={{
            height: "max-content",
          }}>
          <i
            className={`codicon ${buttonIcon}`}
            style={{
              // fontSize: "200%",
              padding: "0.5rem 0",
              // color: "var(--button-primary-hover-background)",
            }}></i>
        </VSCodeButton>
      </div>
      <hr
        style={{
          width: "100%",
          border: "1px solid var(--vscode-editor-foreground)",
        }}
      />
    </div>
  );
};

export default AccountButton;
