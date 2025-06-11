import React from "react";
import { LintingResult } from "../types/results";
import { PaintColorToken } from "../types/tokens";

// We need to convert them to 0-255 for css.
// Figma stores rgb values in a 0-1 range.
function convertFigmaPaintToCSS(paint: Paint) {
  if (paint.type === 'SOLID') {
    const rgbInput = paint.color;
    const r = Math.round(255 * rgbInput.r);
    const g = Math.round(255 * rgbInput.g);
    const b = Math.round(255 * rgbInput.b);
    return `rgba(${r},${g},${b},${paint.opacity ?? 1})`;
  }
  // Fallback for non-solid paints
  return 'transparent';
}

interface FigmaRGB {
  r: number;
  g: number;
  b: number;
}

function convertFigmaColorToCSS(color: FigmaRGB, opacity: number): string {
  const r = Math.round(255 * color.r)
  const g = Math.round(255 * color.g)
  const b = Math.round(255 * color.b)
  return `rgba(${r},${g},${b},${opacity})`
}

const ColorReference: React.FC<{
  colorReference: PaintColorToken | PaintStyle | Paint,
  testMode?: "used" | "source",
  colorStatus?: string | null
}> = ({ colorReference, testMode = "used", colorStatus = null }) => {
  let colorLabel = "";
  switch (testMode) {
    case "used":
      colorLabel = "Tested:";
      break;
    case "source":
      colorLabel = "Source:";
      break;
    default:
      colorLabel = "";
  }

  try {
    let backgroundColor;
    if ('name' in colorReference) {
      // It's a PaintColorToken
      backgroundColor = convertFigmaPaintToCSS(colorReference.paints[0] as Paint);
    } else if ('color' in colorReference) {
      // It's a Figma Paint
      backgroundColor = convertFigmaColorToCSS(colorReference.color, colorReference.opacity ?? 1);
    } else {
      throw new Error("Invalid color reference type");
    }

    let colorSwatchName = "";
    let colorSwatchDescription = colorStatus;
    switch (true) {
      case 'name' in colorReference:
        colorSwatchName = colorReference.name;
        colorSwatchDescription = colorReference.description || "";
        break;
      case 'colorName' in colorReference:
        colorSwatchName = (colorReference as { colorName: string }).colorName;
        break;
      case 'color' in colorReference:
        colorSwatchName = `rgb(${Math.round(255 * colorReference.color.r)}, ${Math.round(255 * colorReference.color.g)}, ${Math.round(255 * colorReference.color.b)})`;
        break;
      default:
        colorSwatchName = "";
    }

    return (
      <div className={`result-color-token ${testMode}`}>
        <span
          className="color-swatch"
          style={{
            backgroundColor: backgroundColor,
          }}
        ></span>

        <span className="color-swatch-name">
          {colorLabel}: {colorSwatchName}
        </span>
        <span className="color-swatch-description">
          {colorSwatchDescription}
        </span>

      </div>
    );

  } catch (error) {
    console.error("Error in ColorReference:", error);
    return (
      <div className="result-color-token error">
        <span className="color-swatch error">
          Error: {error instanceof Error ? error.message : String(error)}
        </span>
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
  const { usedColor, correspondingColor } = result;
  return (
    <div className={`test-result ${resultClass}`} onClick={handleClick}>
      <div className={`result-test ${resultClass}`}>{(result.pass) ? "PASS" : "FAIL"}</div>
      <div className="result-test-name">{result.test}</div>
      <div className="result-node">{result.name} <span className="result-node-type">{result.type}</span></div>
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
