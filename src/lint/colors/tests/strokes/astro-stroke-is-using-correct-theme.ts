import { AstroTheme } from "../../../../types/tokens";
import { TestableNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { tokens } from "../../../../tokens";
import { getColorAndColorType } from "../../helpers/get-color-and-color-type";

interface AstroStrokeIsUsingCorrectTheme {
  (node: TestableNode, theme: AstroTheme): Promise<LintingResult>;
}

const astroStrokeIsUsingCorrectTheme: AstroStrokeIsUsingCorrectTheme = (
  node,
  theme
) => {
  return new Promise((resolve) => {
    (async () => {
      const { colorTokens } = tokens();
      const test = "Using Astro Color Stroke in Correct Theme";
      const name = node.name;
      const pass = false;
      const message = "";
      const { usedColor, usedColorType } = await getColorAndColorType(node, "stroke");
      const astroColorNameWithTheme =
        usedColor && "name" in usedColor
          ? `${theme}/${usedColor.name}`
          : undefined;
      const astroColorFromTheme = astroColorNameWithTheme
        ? colorTokens.get(astroColorNameWithTheme)
        : undefined;
      const usedColorMatchesThemedColor =
        usedColor && astroColorFromTheme && "id" in usedColor
          ? usedColor.id === astroColorFromTheme.id
          : false;

      const testResult: LintingResult = {
        test,
        id: `${test}-0`,
        pass,
        message,
        name,
        node,
        nodeType: node.type,
        usedColor,
      };

      switch (true) {
        case usedColorType === "astroToken" && usedColorMatchesThemedColor: {
          resolve({
            ...testResult,
            id: `${test}-1`,
            pass: true,
            message: `Node is using a stroke style from Astro in the correct theme (${theme})`,
          });
          break;
        }

        case usedColorType === "astroToken" && !usedColorMatchesThemedColor: {
          resolve({
            ...testResult,
            id: `${test}-2`,
            pass: false,
            message: `Node is using a stroke style from Astro but not using the correct theme (${theme})`,
          });
          break;
        }

        case usedColorType === "paintStyle": {
          resolve({
            ...testResult,
            id: `${test}-3`,
            pass: false,
            message: `Node is stroked with a stroke style but not using a stroke style from Astro`,
          });
          break;
        }

        case usedColorType === "paint": {
          resolve({
            ...testResult,
            id: `${test}-4`,
            pass: false,
            message: `Node is stroked with a color but not using a stroke style from Astro`,
          });
          break;
        }

        case !usedColor: {
          resolve({
            ...testResult,
            id: `${test}-5`,
            ignore: true,
            pass: true,
            message: `Node has no strokes`,
          });
          break;
        }

        default: {
          resolve({
            ...testResult,
            id: `${test}-6 `,
            message: `An unexpected error occurred when linting strokes`,
          });
        }
      }
    })();
  });
};

export { astroStrokeIsUsingCorrectTheme };
