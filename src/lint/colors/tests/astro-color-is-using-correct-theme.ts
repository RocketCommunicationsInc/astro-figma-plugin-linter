import { FillStyleNode } from "../../../types";
import { LintingResult, AstroTheme } from "../../types";
import { stripToLoadableId } from "../../../tokens";
import { tokens } from "../../../tokens";
const { colorTokens } = tokens();

const astroColorIsUsingCorrectTheme = (
  node: FillStyleNode,
  theme: AstroTheme
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Astro Color in Correct Theme";
    const name = node.name;
    const fillStyleId = (node.fillStyleId as string) || "";
    const astroColor = colorTokens.get(stripToLoadableId(fillStyleId));
    const fills = node.fills;
    let pass = false;
    let message = "";
    if (astroColor?.name) {
      const astroColorNameWithTheme = `${theme}/${astroColor?.name}`;
      const astroColorWithTheme = colorTokens.get(astroColorNameWithTheme);
      pass = astroColor?.id === astroColorWithTheme?.id ? true : false;
      message = pass
        ? `Node is using a fill style (${astroColor.name}) from Astro but it's not the correct theme (${theme})`
        : `Node is using a fill style (${astroColor.name}) from Astro in the correct theme (${theme})`;
    } else if (Array.isArray(fills) && fills.length === 0) {
      pass = true;
      message = `Node has no fills`;
    } else if (Array.isArray(fills) && fills.length > 0) {
      const visibleFills = fills.filter((fill) => {
          return fill.visible === true;
        });
        if (visibleFills.length === 0 ) {
          resolve({
            test,
            pass: true,
            message: `Node is filled invisibly`,
            name,
            node,
          });
        }
    } else {
      message = `Node is not using a fill style from Astro`;
    }
    const result: LintingResult = {
      test,
      pass,
      message,
      name,
      node,
    };
    resolve(result);
  });
};

export { astroColorIsUsingCorrectTheme };
