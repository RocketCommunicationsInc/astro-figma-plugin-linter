import { TestableNode } from "../../../types/figma";
import { PaintColorToken } from "../../../types/tokens";
import { stripToLoadableId, tokens } from "../../../tokens";

type PaintWithColorName = Paint & { colorName?: string };

type UsedColorResult = {
  usedColor: PaintColorToken | PaintWithColorName | undefined;
  usedColorType: "astroToken" | "paintStyle" | "paint" | undefined;
};

interface GetColorAndColorType {
  (node: TestableNode, testMode?: "fill" | "stroke"): Promise<UsedColorResult>;
}

const getColorAndColorType: GetColorAndColorType = async (
  node,
  testMode = "fill"
) => {
  return new Promise((resolve) => {
    // 1. Using an Astro Color Fill Token
    // 2. Using a Figma Paint Style (not an Astro Token)
    // 3. Using a Figma Paint (not a style, just a paint object)
    // 4. Using no fill at all (no fills array or empty fills array)

    (async () => {
      const { colorTokens } = tokens();
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
        Array.isArray(nodeColors) && nodeColors.length > 0
          ? nodeColors[0]
          : null;

      switch (true) {
        case !!astroToken: {
          // If the color is a PaintColorToken
          resolve({
            usedColor: astroToken as PaintColorToken,
            usedColorType: "astroToken",
          });
          break;
        }

        case !!styleId && !astroToken: {
          // If the color is a PaintColorToken
          // load the PaintStyle from the styleId
          let colorStyleName;
          if (typeof styleId === "string") {
            colorStyleName = await figma
              .getStyleByIdAsync(styleId);
          }
          const newColor: PaintWithColorName = {
            ...color,
            colorName: colorStyleName?.name || undefined,
          };
          resolve({
            usedColor: newColor as PaintWithColorName,
            usedColorType: "paintStyle",
          });
          break;
        }

        case !!color && "color" in color && color.visible === true: {
          // If the color is a Figma Paint (not a PaintColorToken)
          resolve({ usedColor: color, usedColorType: "paint" });
          break;
        }

        default: {
          // If no fill/stroke style or fills/strokes are present, return null
          resolve({ usedColor: undefined, usedColorType: undefined });
        }
      }
    })();
  });
};

export { getColorAndColorType, UsedColorResult };
