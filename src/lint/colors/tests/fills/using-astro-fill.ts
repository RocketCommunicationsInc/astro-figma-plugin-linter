import { TestableNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { getInstanceOverride } from "../../../collect-data/overrides";
import { getColorAndColorType } from "../../helpers/get-color-and-color-type";

interface UsingAstroFill {
  (node: TestableNode): Promise<LintingResult>;
}

const usingAstroFill: UsingAstroFill = (node) => {
  return new Promise((resolve) => {
    (async () => {
      const test = "Using an Astro Color Fill";
      const name = node.name;
      const pass = false;
      const message = "";
      const { usedColor, usedColorType } = await getColorAndColorType(node);

      const instanceOverrides = getInstanceOverride(node.id);
      const overriddenFields = instanceOverrides || null;
      const overriddenFillStyleId = (overriddenFields && overriddenFields.includes("fillStyleId")) ? true : false;

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
        case !!overriddenFillStyleId: {
          // If the usedColor overriding a component default
          resolve({
            ...testResult,
            id: `${test}-1`,
            pass: false,
            message: "Node is overriding a fill style from Astro.",
          });
          break;
        }

        case !!usedColor && usedColorType === "astroToken": {
          // If the usedColor is a PaintColorToken
          resolve({
            ...testResult,
            id: `${test}-2`,
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
            id: `${test}-3`,
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
            id: `${test}-4`,
            pass: false,
            message: "Node is using a fill color, not a fill style from Astro.",
          });
          break;
        }

        case !usedColor: {
          // If no fill style or fills are present, return null
          resolve({
            ...testResult,
            id: `${test}-5`,
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
    })();
  });
};

export { usingAstroFill };
