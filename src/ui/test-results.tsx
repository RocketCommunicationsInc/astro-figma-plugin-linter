import React from "react";
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

const TestResult: React.FC<{ result: LintingResult, debug: boolean }> = ({ result, debug }) => {
  // Click on result name to select the node in Figma
  const handleClick = () => {
    parent.postMessage({ pluginMessage: { type: 'select-node', nodeId: result.node.id } }, '*');
  };

  const resultClass = result.pass ? "pass" : "fail";
  return (
    <div className={`test-result ${resultClass}`} onClick={handleClick}>
      <div className={`result-test ${resultClass}`}>{(result.pass) ? "PASS" : "FAIL"}</div>
      <div className="result-test-name">{result.test}</div>
      <div className="result-node">{result.name}</div>
      <div className="result-message">{result.message}</div>
      <div className="result-references">
        {result.usedColorToken && (
          <div className="result-color-token used">
            <span
              className="color-swatch"
              style={{
                backgroundColor: convertFigmaPaintToCSS(result.usedColorToken.paints[0]),
              }}
            ></span>
            <span className="color-swatch-name">
              Tested: {result.usedColorToken.name}
            </span>
            <span className="color-swatch-description">
              {result.usedColorToken.description}
            </span>
          </div>
        )}
        {result.sourceColorToken && (
          <div className="result-color-token source">
            <span
              className="color-swatch"
              style={{
                backgroundColor: convertFigmaPaintToCSS(result.sourceColorToken.paints[0]),
              }}
            ></span>
            <span className="color-swatch-name">
              Astro: {result.sourceColorToken.name}
            </span>
            <span className="color-swatch-description">
              {result.sourceColorToken.description}
            </span>
          </div>
        )}
      </div>
      {debug && (
        <div className="result-id">{result.id}</div>
      )}
    </div>
  );
}

const TestResults: React.FC<{results: LintingResult[], debug: boolean}> = ({ results, debug }) => {
  return (
    <div className="test-results">
      {results.map((result, index) => (
        <TestResult key={index} result={result} debug={debug} />
      ))}
    </div>
  );
};

export {
  TestResult,
  TestResults
}
