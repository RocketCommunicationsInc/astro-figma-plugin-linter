import { AstroTheme } from "../../../../types/tokens";
import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { stripToLoadableId } from "../../../../tokens";
import { tokens } from "../../../../tokens";
const { colorTokens } = tokens();

const astroFillIsUsingCorrectTheme = (
  node: FillStyleNode,
  theme: AstroTheme
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Astro Color Fill in Correct Theme";
    const name = node.name;
    const fillStyleId = (node.fillStyleId as string) || "";
    const astroColor = colorTokens.get(stripToLoadableId(fillStyleId));
    const fills = node.fills;
    const pass = false;
    const message = "";

    const testResult: LintingResult = {
      test,
      id: `${test}-0`,
      pass,
      message,
      name,
      node,
      type: node.type,
    };

    // Switch logic based on node state
    switch (true) {
      case !!astroColor?.name: {
        const astroColorNameWithTheme = `${theme}/${astroColor?.name}`;
        const astroColorWithTheme = colorTokens.get(astroColorNameWithTheme);
        const pass = astroColor?.id === astroColorWithTheme?.id;
        const message = pass
          ? `Node is using a fill style (${astroColor.name}) from Astro in the correct theme (${theme})`
          : `Node is using a fill style (${astroColor.name}) from Astro but it's not the correct theme (${theme})`;
        resolve({
          ...testResult,
          id: `${test}-1`,
          pass,
          message,
        });
        break;
      }

      case Array.isArray(fills) && fills.length === 0: {
        resolve({
          ...testResult,
          id: `${test}-2`,
          pass: true,
          message: `Node has no fills`,
        });
        break;
      }

      case Array.isArray(fills) && fills.length > 0: {
        const visibleFills = fills.filter((fill) => fill.visible === true);
        if (visibleFills.length === 0) {
          resolve({
            ...testResult,
            id: `${test}-3`,
            pass: true,
            message: `Node is filled invisibly`,
          });
          return;
        }
        break;
      }

      case !fillStyleId: {
        resolve({
          ...testResult,
          id: `${test}-4`,
          ignore: true,
          pass: true,
          message: `Node cannot have a fill`,
        });
        return;
      }

      default: {
        resolve({
          ...testResult,
          id: `${test}-5`,
          message: `Node is not using a stroke style from Astro`,
        });
        return;
      }
    }

    resolve({
      ...testResult,
      message: `An unexpected error occurred when linting fills`,
    });
  });
};

export { astroFillIsUsingCorrectTheme };
