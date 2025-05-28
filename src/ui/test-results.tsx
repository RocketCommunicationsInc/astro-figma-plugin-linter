import React from "react";
import { TestResultsProps } from "../types/ui";
import { LintingResult } from "../types/results";

// We need to convert them to 0-255 for css.
// Figma stores rgb values in a 0-1 range.
function convertFigmaPaintToCSS(paint) {
  const rgbInput = paint.color
  const r = Math.round(255 * rgbInput.r)
  const g = Math.round(255 * rgbInput.g)
  const b = Math.round(255 * rgbInput.b)
  return `rgba(${r},${g},${b},${paint.opacity})`
}

// function

const TestResult: React.FC<{ result: LintingResult }> = ({ result }) => {
  // Click on result name to select the node in Figma
  const handleClick = () => {
    parent.postMessage({ pluginMessage: { type: 'select-node', nodeId: result.node.id } }, '*');
  };

  const resultClass = result.pass ? "pass" : "fail";
  return (
    <div className={`test-result ${resultClass}`} onClick={handleClick}>
      <div className={`result-test ${resultClass}`}>{(result.pass)? "PASS": "FAIL"}</div>
      <div className="result-test-name">{result.test}</div>
      <div className="result-node">{result.name}</div>
      <div className="result-message">{result.message}</div>
      {result.colorToken && (
        <div className="result-color-token">
          <span
            className="color-swatch"
            style={{
              backgroundColor: convertFigmaPaintToCSS(result.colorToken.paints[0]),
            }}
          ></span>
          <span className="color-swatch-name">
            {result.colorToken.name}
          </span>
          <span className="color-swatch-description">
            {result.colorToken.description}
          </span>
        </div>
      )}
      <div className="result-id">{result.id}</div>
    </div>
  );
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  return (
    <div className="test-results">
      {results.map((result, index) => (
        <TestResult key={index} result={result} />
      ))}
    </div>
  );
};

export {
  TestResult,
  TestResults
}
