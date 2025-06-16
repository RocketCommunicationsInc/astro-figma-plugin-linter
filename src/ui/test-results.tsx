import React from "react";
import { LintingResult } from "../types/results";
import { ColorReference } from "./color-reference";



const TestResult: React.FC<{ result: LintingResult, debug: boolean }> = ({ result, debug }) => {
  // Click on result name to select the node in Figma
  const handleClick = () => {
    parent.postMessage({ pluginMessage: { type: 'select-node', nodeId: result.node.id } }, '*');
  };

  const resultClass = result.pass ? "pass" : "fail";
  const { usedColor, correspondingColor } = result;
  return (
    <div className={`test-result ${resultClass}`} onClick={handleClick}>
      <div className={`result-test ${resultClass}`}>{(result.pass) ? "PASS" : "FAIL"}</div>
      <div className="result-test-name">{result.test}</div>
      <div className="result-node">{result.name} <span className="result-node-type">{result.nodeType}</span></div>
      <div className="result-message">{result.message}</div>
      <div className="result-references">
        {usedColor && (
          <ColorReference colorReference={usedColor} />
        )}
        {correspondingColor && (
          <ColorReference colorReference={correspondingColor} testMode="source" colorStatus={result.correspondingColorStatus} />
        )}
        {!correspondingColor && !correspondingColor && (
          <div className="result-color-token source error">
            <span className="color-swatch-error">{result.correspondingColorStatus}</span>
          </div>
        )}
      </div>
      {debug && (
        <div className="result-id">Test ID: {result.id}</div>
      )}
    </div>
  );
}

const TestResults: React.FC<{ results: LintingResult[], debug: boolean }> = ({ results, debug }) => {
  return (
    <div className="test-results">
      {results.map((result, index) => (
        <TestResult key={index} result={result} debug={debug} />
      ))}
    </div>
  );
};

export {
  TestResults
}
