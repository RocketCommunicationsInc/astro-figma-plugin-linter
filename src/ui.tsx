import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";


function App() {
  // Set up the state for the output
  const [output, setOutput] = useState<string>('');

  // Tell the plugin code to lint the selection
  const onLintSelection = () => {
    parent.postMessage({ pluginMessage: { type: 'lint-selection' } }, '*')
  };

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
      if (messageType === "lint-report") {
        setOutput(messageContent);
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
        <pre>
          {output}
        </pre>
      </section>

      <footer className="buttons">
        <button className="primary" onClick={onLintSelection}>
          Test Selection
        </button>
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
