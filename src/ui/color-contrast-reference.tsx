import React from "react";
import { PaintColorToken } from "../types/tokens";
import { convertFigmaColorToCSS, convertFigmaPaintToCSS } from "./convert-figma-colors-to-css";
import { AnalyzedColor } from "../types/results";

const ColorContrastReference: React.FC<{
  colorReferenceForeground: AnalyzedColor,
  colorReferenceBackground: AnalyzedColor,
  colorStatus?: string | null
}> = ({ colorReferenceForeground, colorReferenceBackground, colorStatus = null }) => {
  try {
    const foregroundColor = colorReferenceForeground.rgba;
    const foregroundColorHex = colorReferenceForeground.hex;
    const foregroundColorOkLCH = colorReferenceForeground.oklch;
    const backgroundColor = colorReferenceBackground.rgba;
    const backgroundColorHex = colorReferenceBackground.hex;
    const backgroundColorOkLCH = colorReferenceBackground.oklch;

    return (
      <div className={`result-contrast-token`}>
        <span
          className="contrast-swatch"
          style={{
            backgroundColor: backgroundColorOkLCH,
          }}
        >
          <span className="contrast-swatch-foreground" style={{ color: foregroundColorOkLCH }}>Text</span>
        </span>

        <div className="contrast-color-meta contrast-foreground">
          <div className="contrast-swatch-label">Text</div>
          <div className="contrast-swatch-name foreground-hex">
            <span className="contrast-label">Hex:</span> {foregroundColorHex}
          </div>
          <div className="contrast-swatch-name foreground-rgba">
            <span className="contrast-label">RGBA:</span> {foregroundColor}
          </div>
          <div className="contrast-swatch-name foreground-oklch">
            <span className="contrast-label">OKLCH:</span> {foregroundColorOkLCH}
          </div>
        </div>

        <span className="contrast-swatch-description">
          {colorStatus}
        </span>

        <div className="contrast-color-meta contrast-background">
          <div className="contrast-swatch-label">Background</div>
          <div className="contrast-swatch-name background-hex">
            <span className="contrast-label">Hex:</span> {backgroundColorHex}
          </div>
          <div className="contrast-swatch-name background-rgba">
            <span className="contrast-label">RGBA:</span> {backgroundColor}
          </div>
          <div className="contrast-swatch-name background-oklch">
            <span className="contrast-label">OKLCH:</span> {backgroundColorOkLCH}
          </div>
        </div>

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

export { ColorContrastReference };
