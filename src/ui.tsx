import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import { CopyToClipboardButton } from 'react-clipboard-button';
import JSONPretty from 'react-json-pretty';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONPrettyMon = require('react-json-pretty/themes/monikai.css');
import "./ui.css";


function App() {
  // Set up the state for the output
  const [output, setOutput] = useState<string>('');
  const [readyToCopy, setReadyToCopy] = useState<boolean>(false);

  // Tell the plugin code to lint the selection
  const onLintSelection = () => {
    parent.postMessage({ pluginMessage: { type: 'lint-selection' } }, '*')
  };

  // Tell the plugin code to export color styles
  const onExportColor = () => {
    setOutput("");
    setReadyToCopy(false);
    parent.postMessage({ pluginMessage: { type: 'export-color' } }, '*')
  }

  // Tell the plugin code to export type styles
  const onExportType = () => {
    setOutput("");
    setReadyToCopy(false);
    parent.postMessage({ pluginMessage: { type: 'export-type' } }, '*')
  }

  // Tell the plugin code to close the plugin
  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  // Listen for messages from the plugin code
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const messageType = event.data.pluginMessage.type;
      const messageContent = event.data.pluginMessage.content;
      console.log("got this from the plugin code", messageType, messageContent);
      // Handle incoming message with exported JSON
      if (messageType === "exportJSON") {
        setOutput(messageContent);
        setReadyToCopy(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <main>
      <header>
        <p>Select objects to test</p>
      </header>

      <section className="feedback">
        <JSONPretty
          className="json-text"
          id="bi-json-export"
          data={JSON.stringify(output)}
          theme={JSONPrettyMon}
        />
      </section>

      <footer className="buttons">
        <button className="primary" onClick={onLintSelection}>
          Test Selection
        </button>
        <button onClick={onCancel}>Cancel</button>

        {/* Tools for plugin developers */}
        <div className="dev-actions">
          <h4>Dev Actions</h4>
          <button onClick={onExportColor}>
            Export Color Styles
          </button>
          <button onClick={onExportType}>
            Export Text Styles
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

        </div>
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
