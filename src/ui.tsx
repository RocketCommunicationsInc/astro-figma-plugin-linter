import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom/client";
import { TestResults } from "./ui/test-results";
import "./ui.css";

function App() {
  // Set up the state for the output
  const [output, setOutput] = useState<string>('');
  const [theme, setTheme] = useState<string>('dark');
  const [results, setResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

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
        setResults(messageContent);
        setFilteredResults(messageContent);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <main>
      <header className="buttons">
        {results.length === 0 && (
          <div>Select objects to test</div>
        )}
        <button className="primary" onClick={onLintSelection}>
          Test Selection
        </button>
        <button onClick={onCancel}>Close</button>
        <div className="theme-selection">
          Astro Theme:
          <label>
            <input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={handleThemeChange} />
            Dark
          </label>
          <label>
            <input type="radio" name="theme" value="light" checked={theme === "light"} onChange={handleThemeChange} />
            Light
          </label>
        </div>
      </header>

      <section className="feedback">
        <TestResults results={filteredResults} />
      </section>

      {results.length > 0 && (
        <footer className="meta-filters">
          <button className="filter-button pass" onClick={() => setFilteredResults(results.filter(result => result.pass === true))}>
            {results.filter(result => result.pass === true).length} passed
          </button>
          <button className="filter-button fail" onClick={() => setFilteredResults(results.filter(result => result.pass === false))}>
            {results.filter(result => result.pass === false).length} failed
          </button>
          <button className="filter-button reset" onClick={() => setFilteredResults(results)}>
            {results.length} total
          </button>
        </footer>
      )}
    </main>
  );
}

const rootElement = document.getElementById("react-page");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  console.error("Failed to find the root element with id 'react-page'.");
}
