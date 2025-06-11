import { TestableNode } from "../../../types/figma";
import { PaintColorToken } from "../../../types/tokens";
import { stripToLoadableId, tokens } from "../../../tokens";
const { colorTokens } = tokens();

type UsedColorResult = {
  usedColor: PaintColorToken | Paint | undefined;
  usedColorType: "astroToken" | "paintStyle" | "paint" | undefined;
};

interface GetFirstColorFillAndType {
  (node: TestableNode, testMode?: "fill" | "stroke"): UsedColorResult;
}

const getFirstColorFillAndType: GetFirstColorFillAndType = (
  node,
  testMode = "fill"
): UsedColorResult => {
  // 1. Using an Astro Color Fill Token
  // 2. Using a Figma Paint Style (not an Astro Token)
  // 3. Using a Figma Paint (not a style, just a paint object)
  // 4. Using no fill at all (no fills array or empty fills array)

  let styleId;
  let nodeColors;

  switch (testMode) {
    case "fill":
      styleId = "fillStyleId" in node ? node.fillStyleId : null;
      nodeColors = node.fills;
      break;
    case "stroke":
      styleId = "strokeStyleId" in node ? node.strokeStyleId : null;
      nodeColors = node.strokes;
      break;
    default:
      throw new Error("Invalid test mode. Use 'fill' or 'stroke'.");
  }

  const astroToken =
    typeof styleId === "string"
      ? colorTokens.get(stripToLoadableId(styleId))
      : null;
  const color =
    Array.isArray(nodeColors) && nodeColors.length > 0 ? nodeColors[0] : null;

  switch (true) {
    case !!astroToken: {
      // If the color is a PaintColorToken
      return {
        usedColor: astroToken as PaintColorToken,
        usedColorType: "astroToken",
      };
    }
    case !!styleId && !astroToken: {
      // If the color is a PaintColorToken
      return { usedColor: color as Paint, usedColorType: "paintStyle" };
    }
    case !!color && "color" in color && color.visible === true: {
      // If the color is a Figma Paint (not a PaintColorToken)
      return { usedColor: color, usedColorType: "paint" };
    }
    default: {
      // If no fill/stroke style or fills/strokes are present, return null
      return { usedColor: undefined, usedColorType: undefined };
    }
  }
};

export { getFirstColorFillAndType, UsedColorResult };
