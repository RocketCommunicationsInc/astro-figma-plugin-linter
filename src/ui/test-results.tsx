import React from "react";
import { LintingResult } from "../types/results";
import { PaintColorToken } from "../types/tokens";

// We need to convert them to 0-255 for css.
// Figma stores rgb values in a 0-1 range.
function convertFigmaPaintToCSS(paint) {
  const rgbInput = paint.color
  const r = Math.round(255 * rgbInput.r)
  const g = Math.round(255 * rgbInput.g)
  const b = Math.round(255 * rgbInput.b)
  return `rgba(${r},${g},${b},${paint.opacity})`
}

function convertFigmaColorToCSS(color, opacity) {
  const r = Math.round(255 * color.r)
  const g = Math.round(255 * color.g)
  const b = Math.round(255 * color.b)
  return `rgba(${r},${g},${b},${opacity})`
}

const ColorReference: React.FC<{ colorReference: PaintColorToken | PaintStyle | Paint }> = ({ colorReference }) => {
  try {
    debugger;
    let backgroundColor;
    if ('name' in colorReference) {
      // It's a PaintColorToken
      backgroundColor = convertFigmaPaintToCSS(colorReference.paints[0]);
      console.log('colorReference is a PaintColorToken', colorReference);
    } else if ('color' in colorReference) {
      // It's a Figma Paint
      backgroundColor = convertFigmaColorToCSS(colorReference.color, colorReference.opacity);
      console.log('colorReference is a Figma Paint', colorReference);
    } else {
      throw new Error("Invalid color reference type");
    }
    return (
      <div className="result-color-token used">
        <span
          className="color-swatch"
          style={{
            backgroundColor: backgroundColor,
          }}
        ></span>
        {'name' in colorReference && (
          <>
            <span className="color-swatch-name">
              Tested: {colorReference.name}
            </span>
            <span className="color-swatch-description">
              {colorReference.description}
            </span>
          </>
        )}
      </div>
    );

  } catch (error) {
    console.error("Error in ColorReference:", error);
    return (
      <div className="result-color-token error">
        <span className="color-swatch error">Error: {error.message}</span>
      </div>
    );
  }
}

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
      <div className="result-node">{result.name} <span className="result-node-type">{result.type}</span></div>
      <div className="result-message">{result.message}</div>
      <div className="result-references">
        {result.usedColor && (
          <ColorReference colorReference={result.usedColor} />
        )}
        {result.sourceColor && (
          <div className="result-color-token source">
            <span
              className="color-swatch"
              style={{
                backgroundColor: convertFigmaPaintToCSS(result.sourceColor.paints[0]),
              }}
            ></span>
            <span className="color-swatch-name">
              Astro: {result.sourceColor.name}
            </span>
            <span className="color-swatch-description">
              {result.sourceColor.description}
            </span>
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
  TestResult,
  TestResults
}
