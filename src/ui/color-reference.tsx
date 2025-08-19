import React from "react";
import { PaintColorToken } from "../types/tokens";
import { convertFigmaColorToCSS, convertFigmaPaintToCSS } from "./convert-figma-colors-to-css";

interface ColorReferenceProps {
  colorReference: PaintColorToken | PaintStyle | SolidPaint;
  testMode?: "used" | "source";
  colorStatus?: string | null;
}

const ColorReference: React.FC<ColorReferenceProps> = ({ colorReference, testMode = "used", colorStatus = null }) => {
  try {
    let colorLabel = "";
    switch (testMode) {
      case "used":
        colorLabel = "Result";
        break;
      case "source":
        colorLabel = "Expected";
        break;
      default:
        colorLabel = "";
    }

    let colorReferenceType, backgroundColor;
    let colorSwatchName = "";
    let colorSwatchDescription = colorStatus;
    if ('name' in colorReference) {
      colorReferenceType = "PaintColorToken";
    } else if ('color' in colorReference) {
      colorReferenceType = "FigmaPaint";
    } else {
      throw new Error("Invalid color reference type");
    }

    switch (colorReferenceType) {
      case "PaintColorToken": {
        const cr = colorReference as PaintColorToken;
        backgroundColor = convertFigmaPaintToCSS(cr.paints[0] as Paint);
        colorSwatchName = cr.name;
        colorSwatchDescription = cr.description || "";
        break;
      }
      case "FigmaPaint":
      default: {
        const cr = colorReference as SolidPaint;
        backgroundColor = convertFigmaColorToCSS(cr.color, cr.opacity ?? 1);
        colorSwatchName = (colorReference as unknown as { colorName: string }).colorName;
        break;
      }
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
