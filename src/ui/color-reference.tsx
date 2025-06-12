import React from "react";
import { PaintColorToken } from "../types/tokens";
import { convertFigmaColorToCSS, convertFigmaPaintToCSS } from "./convert-figma-colors-to-css";

const ColorReference: React.FC<{
  colorReference: PaintColorToken | PaintStyle | Paint,
  testMode?: "used" | "source",
  colorStatus?: string | null
}> = ({ colorReference, testMode = "used", colorStatus = null }) => {
  try {
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

export { ColorReference };
