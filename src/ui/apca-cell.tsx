import React from "react";

type ApcaCellProps = {
  weightIndex: string;
  minSize: string | number;
  fontWeight: number | undefined;
  backgroundColorOkLCH: string | undefined;
  foregroundColorOkLCH: string | undefined;
  fontStack: string | undefined;
  fontItalic: boolean | undefined;
};

const ApcaCell = ({
  weightIndex, minSize, fontWeight, backgroundColorOkLCH, foregroundColorOkLCH, fontStack, fontItalic,
}: ApcaCellProps) => {
  const exampleFontWeight = (Number(weightIndex) + 1) * 100;
  const minSizeString = (minSize !== "placeholder") ? minSize : "none";
  const minSizeExampleString = (minSize !== "placeholder") ? minSize : "Text";
  const activeClass = (exampleFontWeight === fontWeight) ? "active" : "";
  if (Number(weightIndex) <= 7) {
    return (
      <div className={`contrast-apca-example ${activeClass}`}>
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
    );
  }
  return null;
};

export { ApcaCell };
