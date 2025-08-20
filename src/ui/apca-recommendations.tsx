import React from "react";
import { ApcaInterpolatedFont } from "../types/results";
import { ApcaCell } from "./apca-cell";

type ApcaRecommendationsProps = {
  apcaInterpolatedFont: ApcaInterpolatedFont;
  fontWeight: number | undefined;
  backgroundColorOkLCH: string | undefined;
  foregroundColorOkLCH: string | undefined;
  fontStack: string | undefined;
  fontItalic: boolean | undefined;
};

const ApcaRecommendations = ({
  apcaInterpolatedFont,
  fontWeight,
  backgroundColorOkLCH,
  foregroundColorOkLCH,
  fontStack,
  fontItalic,
}: ApcaRecommendationsProps): React.JSX.Element => (
  <div className="contrast-apca-recommendations">
    <div className="contrast-apca-recommendations-label contrast-label">
      APCA Recommendations <span className="contrast-apca-recommendations-label-note">(weight / minimum size)</span>
    </div>
    <div className="contrast-apca-examples">
      {apcaInterpolatedFont &&
        Object.entries(apcaInterpolatedFont).map(([weightIndex, minSize]) => (
          <ApcaCell
            key={weightIndex}
            weightIndex={weightIndex}
            minSize={minSize}
            fontWeight={fontWeight}
            backgroundColorOkLCH={backgroundColorOkLCH}
            foregroundColorOkLCH={foregroundColorOkLCH}
            fontStack={fontStack}
            fontItalic={fontItalic}
          />
        ))}
    </div>
  </div>
)

export { ApcaRecommendations };
