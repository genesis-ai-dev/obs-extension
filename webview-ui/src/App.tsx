import { useEffect, useState } from "react";
import "react-virtualized/styles.css";
import "./App.css";
import { vscode } from "./utilities/vscode";
import { markdownToStories, storiesToMarkdown } from "./utilities/editor";
import ObsEditorPanel from "./components/ObsEditorPanel";
import ObsReadonlyPanel from "./components/ObsReadonlyPanel";
import { useDocument } from "./hooks/useDocument";
import { ObsStory, MessageType } from "../../src/types";

function App() {
  const [stories, setStories] = useState<ObsStory[]>([]);
  const { document: markdownDoc, isReadonly } = useDocument();

  useEffect(() => {
    vscode.setMessageListeners();
  }, []);

  useEffect(() => {
    if (markdownDoc) {
      setStories(markdownToStories(markdownDoc ?? "") as []);
    }
  }, [markdownDoc]);

  const handleSetStoryChange = (story: Record<string, any>[]) => {
    setStories(story as []);
    const docMarkdown = storiesToMarkdown(story);

    vscode.postMessage({
      type: MessageType.save,
      payload: docMarkdown,
    });
  };

  if (isReadonly) {
    return (
      <div className="card">
        <ObsReadonlyPanel obsStory={stories} />
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div>
          <ObsEditorPanel obsStory={stories} setStory={handleSetStoryChange} />
        </div>
      </div>
    </>
  );
}

export default App;
