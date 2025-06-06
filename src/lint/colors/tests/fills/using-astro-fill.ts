import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { stripToLoadableId } from "../../../../tokens";
import { tokens } from "../../../../tokens";
import { PaintColorToken } from "../../../../types/tokens";
const { colorTokens } = tokens();

type UsedColorResult = {
  usedColor: PaintColorToken | Paint | undefined;
  usedColorType: "astroToken" | "paintStyle" | "paint" | undefined;
};

const getFirstColorFill = (node: FillStyleNode): UsedColorResult => {
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

interface UsingAstroFill {
  (
    node: FillStyleNode,
    nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null
  ): Promise<LintingResult>;
}

const usingAstroFill: UsingAstroFill = (
  node,
  nearestSourceAstroComponent
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using an Astro Color Fill";
    const name = node.name;
    // const fillStyleId = node.fillStyleId;
    const pass = false;
    const message = "";
    const { usedColor, usedColorType } = getFirstColorFill(node);

    const testResult: LintingResult = {
      test,
      id: `${test}-0`,
      pass,
      message,
      name,
      node,
      type: node.type,
      usedColor,
    };

    switch (true) {
      case !!usedColor && usedColorType === "astroToken": {
        // If the usedColor is a PaintColorToken
        resolve({
          ...testResult,
          id: `${test}-1`,
          pass: true,
          message: "Node is using a fill style from Astro.",
        });
        break;
      }

      case !!usedColor && usedColorType === "paintStyle": {
        // If the usedColor is a PaintStyle but not an Astro PaintColorToken
        // This means the node is using a fill style but not from Astro
        resolve({
          ...testResult,
          id: `${test}-2`,
          pass: false,
          message: "Node is using a fill style not from Astro.",
        });
        break;
      }

      case !!usedColor && usedColorType === "paint": {
        // If the usedColor is a Paint (Figma Paint) but not an Astro PaintColorToken
        // This is not a style, just a paint object
        resolve({
          ...testResult,
          id: `${test}-3`,
          pass: false,
          message: "Node is using a fill color, not a style not from Astro.",
        });
        break;
      }

      case !usedColor: {
        // If no fill style or fills are present, return null
        resolve({
          ...testResult,
          id: `${test}-4`,
          pass: true,
          message: "Node has no fill styles or fills.",
        });
        break;
      }

      default: {
        resolve({
          ...testResult,
          message: `An unexpected error occurred when linting fills`,
        });
      }
    }
  });
};

export { usingAstroFill };
