import { LintingResult } from "../types/results";
import { TestResults } from "./test-results";
import React, { useState, useEffect } from "react";
import "./ui.css";

const LinterUi = () => {
  // Set up the state for the output
  const [theme, setTheme] = useState<string>('dark');
  const [results, setResults] = useState<LintingResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<LintingResult[]>([]);
  const [debug, setDebug] = useState<boolean>(true);

  // Tell the plugin code to lint the selection
  const onLintSelection = () => {
    parent.postMessage({ pluginMessage: { type: 'lint-selection', theme: theme } }, '*')
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
      <header className="header">
        <img src={require("../logo-circle.svg")} alt="Logo" className="logo" />

        <div className="buttons">
          <button className="primary" onClick={onLintSelection}>
            Test Selection
          </button>
        </div>
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
        {results.length === 0 && (
          <div>Select objects to test</div>
        )}
        <TestResults results={filteredResults} debug={debug} />
      </section>

      <footer className="meta-filters">
        <div className="debug-switch">
          <label>
            <input type="checkbox" checked={debug} onChange={() => setDebug(!debug)} />
            Debug Mode
          </label>
        </div>
        <button className="filter-button pass" onClick={() => setFilteredResults(results.filter(result => result.pass === true))}>
          {results.filter(result => result.pass === true).length} pass
        </button>
        <button className="filter-button fail" onClick={() => setFilteredResults(results.filter(result => result.pass === false))}>
          {results.filter(result => result.pass === false).length} fail
        </button>
        <button className="filter-button reset" onClick={() => setFilteredResults(results)}>
          {results.length} total
        </button>
      </footer>
    </main>
  );
}

export { LinterUi }
