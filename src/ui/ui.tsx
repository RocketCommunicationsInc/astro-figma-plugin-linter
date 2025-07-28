import React, { useState, useEffect } from "react";
import { CopyToClipboardButton } from 'react-clipboard-button';
import { LintingResult } from "../types/results";
import { TestResults } from "./test-results";
import { SelectFilter } from "./select-filter";

import "./css/variables.css";
import "./css/base.css";
import "./css/layout.css";
import "./css/buttons.css";
import "./css/test-results-layout.css";
import "./css/test-results.css";
import "./css/filters.css";

const LinterUi = () => {
  // Set up the state for the output
  const [debug] = useState<boolean>(false); // Set to true to show debug information
  const [advancedFilters, setAdvancedFilters] = useState<boolean>(false);
  const [filteredResults, setFilteredResults] = useState<LintingResult[]>([]);
  const [results, setResults] = useState<LintingResult[]>([]);
  const [selectedNodeType, setSelectedNodeType] = useState<string>("");
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [selectedTestType, setSelectedTestType] = useState<string>("");
  const [theme, setTheme] = useState<string>('dark');
  const [readyToCopy, setReadyToCopy] = useState<boolean>(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);

  // Tell the plugin code to lint the selection
  const onLintSelection = () => {
    setReadyToCopy(false);
    setCopiedToClipboard(false);
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
        const sortedResults = (messageContent as LintingResult[]).sort((a: LintingResult, b: LintingResult) => a.id.localeCompare(b.id));
        setResults(sortedResults);
        setFilteredResults(messageContent);
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
      <header className="header">
        <button className="lint-button" onClick={onLintSelection}>
          Test Selection
        </button>

        <div className="theme-selection">
          <div>Astro Theme:</div>
          <label>
            <input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={handleThemeChange} />
            Dark
          </label>
          <label>
            <input type="radio" name="theme" value="light" checked={theme === "light"} onChange={handleThemeChange} />
            Light
          </label>
          <label>
            <input type="radio" name="theme" value="wireframe" checked={theme === "wireframe"} onChange={handleThemeChange} />
            Wireframe
          </label>
        </div>

        <div className="filter-buttons">
          <label className="filter-label">Filters</label>
          <div className="filter-button-group">
            <button className="filter-button pass" onClick={() => setFilteredResults(results.filter(result => result.pass === true))}>
              {results.filter(result => result.pass === true).length} pass
            </button>
            <button className="filter-button fail" onClick={() => setFilteredResults(results.filter(result => result.pass === false))}>
              {results.filter(result => result.pass === false).length} fail
            </button>
            <button className="filter-button reset" onClick={() => setFilteredResults(results)}>
              {results.length} total
            </button>
          </div>
        </div>
      </header>

      <section className="user-display">
        {results.length === 0 && (
          <div className="emptyText">Select objects to test</div>
        )}
        <TestResults results={filteredResults} debug={debug} />
      </section>

      <footer className="meta-filters">
        {results.length > 0 && (
          <>
            {!readyToCopy ? (
              <button className="primary" disabled>Export Results</button>
            ) : (
              <CopyToClipboardButton
                text={JSON.stringify(results)}
                onSuccess={() => setCopiedToClipboard(true)}
                onError={() => setCopiedToClipboard(false)}
              >
                <button className="primary">
                  {!copiedToClipboard ? "Export Results" : "Copied to Clipboard"}
                </button>
              </CopyToClipboardButton>
            )}

            <div className="debug-switch">
              <label>
                <input type="checkbox" checked={advancedFilters} onChange={() => setAdvancedFilters(!advancedFilters)} />
                More Filters
              </label>
            </div>
          </>
        )}
        {advancedFilters && results.length > 0 && (
          <div className="advanced">
            {/* Dropdown list to filter results based on result.id */}
            <SelectFilter
              results={results}
              setFilteredResults={setFilteredResults}
              filteredField="id"
              resultFieldToFilter={selectedTest}
              setResultFieldToFilter={setSelectedTest}
              otherFilters={[setSelectedNodeType, setSelectedTestType]}
            />

            {/* Dropdown list to filter results based on result.testType */}
            <SelectFilter
              results={results}
              setFilteredResults={setFilteredResults}
              filteredField="testType"
              resultFieldToFilter={selectedTestType}
              setResultFieldToFilter={setSelectedTestType}
              otherFilters={[setSelectedTest, setSelectedNodeType]}
            />

            {/* Dropdown list to filter results based on result.type */}
            <SelectFilter
              results={results}
              setFilteredResults={setFilteredResults}
              filteredField="nodeType"
              resultFieldToFilter={selectedNodeType}
              setResultFieldToFilter={setSelectedNodeType}
              otherFilters={[setSelectedTest, setSelectedTestType]}
            />
          </div>
        )}

      </footer>
    </main>
  );
}

export { LinterUi }
