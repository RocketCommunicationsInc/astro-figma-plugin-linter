import React from "react";
import { AnalyzedColor, LintingResult } from "../types/results";
import { ColorReference } from "./color-reference";
import { TypographyReference } from "./typography-reference";
import { ColorContrastReference } from "./color-contrast-reference";
import { PaintColorToken } from "../types/tokens";

const TestResult: React.FC<{ result: LintingResult, debug: boolean }> = ({ result, debug }) => {
  // Click on result name to select the node in Figma
  const handleClick = () => {
    parent.postMessage({ pluginMessage: { type: 'select-node', nodeId: result.node.id } }, '*');
  };

  const resultClass = result.pass ? "pass" : "fail";
  const { testType, usedTypography, correspondingTypography, contrastTypography } = result;

  const usedColor = result.usedColor;
  const correspondingColor = result.correspondingColor;
  let usedColorFills, correspondingColorFills: PaintColorToken | PaintStyle | SolidPaint | undefined;
  let usedColorContrast, correspondingColorContrast: AnalyzedColor | undefined;

  switch (true) {
    case usedColor && ("oklch" in usedColor):
      usedColorContrast = usedColor as AnalyzedColor;
      break;
    default:
      usedColorFills = usedColor as PaintColorToken | PaintStyle | SolidPaint;
  }
  switch (true) {
    case correspondingColor && ("oklch" in correspondingColor):
      correspondingColorContrast = correspondingColor as AnalyzedColor;
      break;
    default:
      correspondingColorFills = correspondingColor as PaintColorToken | PaintStyle | SolidPaint;
  }
  
  return (
    <div className={`test-result ${resultClass}`} onClick={handleClick}>
      <div className="result-main">
        <div className="result-primary">
          <div className={`result-test-result ${resultClass}`}>{(result.pass) ? "PASS" : "FAIL"}</div>
          <div className="result-test-name">{result.name}: {result.test}</div>
          <div className="result-message">{result.message}</div>
        </div>
      </div>
      {debug && (
        <div className="result-meta">
          <label className="result-node-type-label">Type</label>
          <div className="result-node-type">{result.nodeType}</div>

          <label className="result-id-label">Test ID</label>
          <div className="result-id">{result.id}</div>

          <label className="result-node-id-label">Node ID</label>
          <div className="result-node-id">{result.node.id}</div>
        </div>
      )}
      <div className="result-references">
        {/* COLOR */}
        {testType === "color" && usedColor && (
          <ColorReference colorReference={usedColorFills} />
        )}
        {testType === "color" && correspondingColor && (
          <ColorReference colorReference={correspondingColorFills} testMode="source" colorStatus={result.correspondingColorStatus} />
        )}
        {testType === "color" && !correspondingColor && (
          <div className="result-color-token source error">
            <span className="token-swatch-error">
              {result.correspondingColorStatus}
            </span>
          </div>
        )}

        {/* TYPOGRAPHY */}
        {testType === "typography" && usedTypography && (
          <TypographyReference typographyReference={usedTypography} />
        )}
        {testType === "typography" && correspondingTypography && (
          <TypographyReference typographyReference={correspondingTypography} />
        )}

        {/* CONTRAST */}
        {testType === "contrast" && usedColor && correspondingColor && (
          <ColorContrastReference 
            colorReferenceForeground={usedColorContrast} 
            colorReferenceBackground={correspondingColorContrast} 
            contrastTypography={contrastTypography}
            colorStatus={result.correspondingColorStatus} 
          />
        )}
      </div>
    </div>
  );
}

const TestResults: React.FC<{ results: LintingResult[], debug: boolean }> = ({ results, debug }) => {
  return (
    <div className={`test-results ${debug ? "debug" : ""}`}>
      {results.map((result, index) => (
        <TestResult key={index} result={result} debug={debug} />
      ))}
    </div>
  );
};

export {
  TestResults
}
