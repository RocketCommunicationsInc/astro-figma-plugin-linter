import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { CopyToClipboardButton } from 'react-clipboard-button';
import JSONPretty from 'react-json-pretty';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONPrettyMon = require('react-json-pretty/themes/monikai.css');
import "./ui.css";


function App() {
  const [output, setOutput] = React.useState<string>();
  const [readyToCopy, setReadyToCopy] = React.useState(false);

  const onLintSelection = () => {
    // parent.postMessage(
    //   { pluginMessage: { type: "lint-selection", count } },
    //   "*"
    // );
  };

  const onExportColor = () => {
    setOutput("");
    setReadyToCopy(false);
    parent.postMessage({ pluginMessage: { type: 'export-color' } }, '*')
  }

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  onmessage = (event) => {
    console.log(['event', event])
    const messageType = event.data.pluginMessage.type;
    const messageContent = event.data.pluginMessage.content;
    console.log("got this from the plugin code", messageType, messageContent)
    console.log(['messageType, messageContent', messageType, messageContent])
    if (messageType === "exportJSON") {
      setOutput(messageContent)
      setReadyToCopy(true)
    }
  }

  return (
    <main>
      <header>
        <h3>Select objects to test</h3>
      </header>
      <section>
        <div className="output">
        <JSONPretty
            className="json-text"
            id="bi-json-export"
            data={JSON.stringify(output)}
            theme={JSONPrettyMon}
          />
        </div>
      </section>
      <footer>
        <button className="brand" onClick={onLintSelection}>
          Test Selection
        </button>
        <button id="export-color" onClick={onExportColor}>
          Export Color Styles
        </button>
        {readyToCopy && (
          <CopyToClipboardButton
            text={JSON.stringify(output)}
            onSuccess={() => console.log('success!')}
            onError={() => console.log('error!')}
          >
            <button>Copy</button>
          </CopyToClipboardButton>
          )}
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  );
}

const rootElement = document.getElementById("react-page");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  console.error("Failed to find the root element with id 'react-page'.");
}
