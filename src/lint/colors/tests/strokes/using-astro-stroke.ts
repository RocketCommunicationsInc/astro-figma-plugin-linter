import { TestableNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { getInstanceOverride } from "../../../collect-data/overrides";
import { getColorAndColorType } from "../../helpers/get-color-and-color-type";

interface UsingAstroStroke {
  (node: TestableNode): Promise<LintingResult>;
}

const usingAstroStroke: UsingAstroStroke = (node) => {
  return new Promise((resolve) => {
    (async () => {
      const test = "Using an Astro Color Stroke";
      const name = node.name;
      const pass = false;
      const message = "";
      const { usedColor, usedColorType } = await getColorAndColorType(
        node,
        "stroke"
      );

      const instanceOverrides = getInstanceOverride(node.id);
      const overriddenFields = instanceOverrides || null;
      const overriddenStrokeStyleId = (overriddenFields && overriddenFields.includes("strokeStyleId")) ? true : false;

      const testResult: LintingResult = {
        test,
        id: `${test}-0`,
        testType: "color",
        pass,
        message,
        name,
        node,
        nodeType: node.type,
        usedColor,
      };

      switch (true) {
        case !!overriddenStrokeStyleId: {
          // If the usedColor overriding a component default
          resolve({
            ...testResult,
            id: `${test}-1`,
            pass: false,
            message: "Node is overriding a stroke style from Astro.",
          });
          break;
        }

        case !!usedColor && usedColorType === "astroToken": {
          // If the usedColor is a PaintColorToken
          resolve({
            ...testResult,
            id: `${test}-2`,
            pass: true,
            message: "Node is using a stroke style from Astro.",
          });
          break;
        }

        case !!usedColor && usedColorType === "paintStyle": {
          // If the usedColor is a PaintStyle but not an Astro PaintColorToken
          // This means the node is using a stroke style but not from Astro
          resolve({
            ...testResult,
            id: `${test}-3`,
            pass: false,
            message: "Node is using a stroke style not from Astro.",
          });
          break;
        }

        case !!usedColor && usedColorType === "paint": {
          // If the usedColor is a Paint (Figma Paint) but not an Astro PaintColorToken
          // This is not a style, just a paint object
          resolve({
            ...testResult,
            id: `${test}-4`,
            pass: false,
            message:
              "Node is using a stroke color, not a style not from Astro.",
          });
          break;
        }

        case !usedColor: {
          // If no fill style or fills are present, return null
          resolve({
            ...testResult,
            id: `${test}-5`,
            pass: true,
            message: "Node has no stroke styles or fills.",
          });
          break;
        }

        default: {
          resolve({
            ...testResult,
            message: `An unexpected error occurred when linting strokes`,
          });
        }
      }
    })();
  });
};

export { usingAstroStroke };
