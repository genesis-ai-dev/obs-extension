import { useEffect, useState } from "react";
import "react-virtualized/styles.css";
import "./App.css";
import { vscode } from "./utilities/vscode";
import { markdownToStories } from "./utilities/editor";
import { useDocument } from "./hooks/useDocument";
import ObsReadonlyPanel from "./components/ObsReadonlyPanel";
import type { ObsStory } from "./types";

function App() {
  const [stories, setStories] = useState<ObsStory[]>([]);
  const { document: markdownDoc } = useDocument();

  useEffect(() => {
    vscode.setMessageListeners();
  }, []);

  useEffect(() => {
    if (markdownDoc) {
      setStories(markdownToStories(markdownDoc ?? "") as []);
    }
  }, [markdownDoc]);

  return (
    <div className="card">
      <ObsReadonlyPanel obsStory={stories} />
    </div>
  );
}

// TODO:
//   - I need to make sure the backend has a message posting for update!
//   - I need to make sure the backend is actually registering this webview code.

export default App;
