import React from "react";
import { AnalyzedColor, ContrastTypography } from "../types/results";

const ColorContrastReference: React.FC<{
  colorReferenceForeground: AnalyzedColor | undefined,
  colorReferenceBackground: AnalyzedColor | undefined,
  contrastTypography?: ContrastTypography,
  colorStatus?: string | null
}> = ({ colorReferenceForeground, colorReferenceBackground, contrastTypography, colorStatus = null }) => {
  try {
    const foregroundColor = colorReferenceForeground && colorReferenceForeground.rgba;
    const foregroundColorHex = colorReferenceForeground && colorReferenceForeground.hex;
    const foregroundColorOkLCH = colorReferenceForeground && colorReferenceForeground.oklch;
    const backgroundColor = colorReferenceBackground && colorReferenceBackground.rgba;
    const backgroundColorHex = colorReferenceBackground && colorReferenceBackground.hex;
    const backgroundColorOkLCH = colorReferenceBackground && colorReferenceBackground.oklch;
    const { fontSize, fontWeight, fontFamily, fontItalic, apcaInterpolatedFont } = contrastTypography || {};

    let fontStack: string;
    switch (fontFamily) {
      case "Roboto":
        fontStack = "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif";
        break;
      default:
        fontStack = "inherit";
    }

    return (
      <div className={`result-contrast-token`}>
        <span
          className="contrast-swatch"
          style={{
            backgroundColor: backgroundColorOkLCH,
          }}
        >
          <span
            className="contrast-swatch-foreground"
            style={
              {
                color: foregroundColorOkLCH,
                fontFamily: fontStack,
                fontSize: fontSize,
                fontWeight: fontWeight,
                fontStyle: fontItalic ? "italic" : "normal",
              }
            }>
            Text
          </span>
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

        {apcaInterpolatedFont && (
          <div className="contrast-apca-recommendations">
            <div className="contrast-apca-recommendations-label contrast-label">
              APCA Recommendations <span className="contrast-apca-recommendations-label-note">(weight / minimum size)</span>
            </div>
            <div className="contrast-apca-examples">
              {Object.entries(apcaInterpolatedFont).map(([weightIndex, minSize]) => {
                const exampleFontWeight = (Number(weightIndex) + 1) * 100;
                const minSizeString = (minSize !== "placeholder") ? minSize : "none";
                const minSizeExampleString = (minSize !== "placeholder") ? minSize : "Text";
                const activeClass = (exampleFontWeight === fontWeight) ? "active" : "";
                if (Number(weightIndex) <= 7) {
                  return (
                    <div
                      className={`contrast-apca-example ${activeClass}`}
                      key={weightIndex}
                    >
                      <div className="contrast-apca-example-meta">
                        <div>{exampleFontWeight}</div>
                        <div>/ {minSizeString}</div>
                      </div>
                      <div
                        className="contrast-apca-example-content"
                        style={{
                          backgroundColor: backgroundColorOkLCH,
                          color: foregroundColorOkLCH,
                          fontFamily: fontStack,
                          fontStyle: fontItalic ? "italic" : "normal",
                          fontWeight: exampleFontWeight,
                          fontSize: minSizeString,
                        }}
                      >
                        {minSizeExampleString}
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        )}


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
