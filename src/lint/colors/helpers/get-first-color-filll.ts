import { TestableNode } from "../../../types/figma";
import { PaintColorToken } from "../../../types/tokens";
import { stripToLoadableId, tokens } from "../../../tokens";
const { colorTokens } = tokens();

type UsedColorResult = {
  usedColor: PaintColorToken | Paint | undefined;
  usedColorType: "astroToken" | "paintStyle" | "paint" | undefined;
};

const getFirstColorFill = (node: TestableNode): UsedColorResult => {
  // 1. Using an Astro Color Fill Token
  // 2. Using a Figma Paint Style (not an Astro Token)
  // 3. Using a Figma Paint (not a style, just a paint object)
  // 4. Using no fill at all (no fills array or empty fills array)
  const fillStyleId = "fillStyleId" in node ? node.fillStyleId : null;
  const astroToken =
    typeof fillStyleId === "string"
      ? colorTokens.get(stripToLoadableId(fillStyleId))
      : null;
  const fills = node.fills;
  const color = Array.isArray(fills) && fills.length > 0 ? fills[0] : null;

  switch (true) {
    case !!astroToken: {
      // If the color is a PaintColorToken
      return {
        usedColor: astroToken as PaintColorToken,
        usedColorType: "astroToken",
      };
    }
    case !!fillStyleId && !astroToken: {
      // If the color is a PaintColorToken
      return { usedColor: color as Paint, usedColorType: "paintStyle" };
    }
    case !!color && "color" in color && color.visible === true: {
      // If the color is a Figma Paint (not a PaintColorToken)
      return { usedColor: color, usedColorType: "paint" };
    }
    default: {
      // If no fill style or fills are present, return null
      return { usedColor: undefined, usedColorType: undefined };
    }
  }
};

export { getFirstColorFill, UsedColorResult };
