import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import "./ui.css";

const TestResult = ({ result }) => {
  console.log('result', result)
  return (
    <div className="result">
      <h3>{result.test}</h3>
      <p>{result.name}</p>
      <p>{result.message}</p>
      <p>Pass: {result.pass}</p>
    </div>
  );
}

const TestResults = ({ results }) => {
  return (
    <div className="results">
      {results.map((result, index) => (
        <TestResult key={index} result={result} />
      ))}
    </div>
  );
};


function App() {
  // Set up the state for the output
  const [output, setOutput] = useState<string>('');
  const [theme, setTheme] = useState<string>('dark');
  const [results, setResults] = useState<any[]>([]);

  // Tell the plugin code to lint the selection
  const onLintSelection = () => {
    parent.postMessage({ pluginMessage: { type: 'lint-selection', theme: theme } }, '*')
  };

  // Tell the plugin code to close the plugin
  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  // Change the theme based on the selected radio button
  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
  };

  // Listen for messages from the plugin code
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const messageType = event.data.pluginMessage.type;
      const messageContent = event.data.pluginMessage.content;
      console.log("got this from the plugin code", messageType, messageContent);
      // Handle incoming message with exported JSON
      if (messageType === "lint-results") {
        console.log('messageContent', messageContent)
        setResults(messageContent);
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
          <TestResults results={results} />
        </pre>
      </section>

      <footer className="buttons">
        <button className="primary" onClick={onLintSelection}>
          Test Selection
        </button>
        <button onClick={onCancel}>Cancel</button>
        <div className="theme-selection">
          <label>
            <input type="radio" name="theme" value="light" checked={theme === "light"} onChange={handleThemeChange} />
            Light Theme
          </label>
          <label>
            <input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={handleThemeChange} />
            Dark Theme
          </label>
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
