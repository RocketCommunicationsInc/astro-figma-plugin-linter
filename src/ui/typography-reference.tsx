import React from "react";
// import { PaintColorToken } from "../types/tokens";
// import { convertFigmaColorToCSS, convertFigmaPaintToCSS } from "./convert-figma-colors-to-css";

const TypographyReference: React.FC<{
  typographyReference: TextStyle | StyledTextSegment,
  testMode?: "used" | "source",
  typographyStatus?: string | null
}> = ({ typographyReference, testMode = "used", typographyStatus = null }) => {
  try {
    let typographyLabel = "";
    switch (testMode) {
      case "used":
        typographyLabel = "Tested: ";
        break;
      case "source":
        typographyLabel = "Source: ";
        break;
      default:
        typographyLabel = "";
    }

    return (
      <div className={`result-typography-token ${testMode}`}>
        <span className="typography-swatch-name">
          {typographyLabel}{"name" in typographyReference ? typographyReference.name : "not a Figma text style"}
        </span>
        <span className="typography-swatch-description">
          {"description" in typographyReference ? typographyReference.description : ""}
        </span>

      </div>
    );

  } catch (error) {
    console.error("Error in TypographyReference:", error);
    return (
      <div className="result-token error">
        <span className="token-swatch error">
          Error: {error instanceof Error ? error.message : String(error)}
        </span>
      </div>
    );
  }
}

export { TypographyReference };
