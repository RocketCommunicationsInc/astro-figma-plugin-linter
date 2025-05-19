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
    const test = "astroColorIsUsingCorrectTheme";
    const name = node.name;
    const fillStyleId = (node.fillStyleId as string) || "";
    const astroColor = colorTokens.get(stripToLoadableId(fillStyleId));
    let pass = false;
    let message = "";
    if (astroColor?.name) {
      const astroColorNameWithTheme = `${theme}/${astroColor?.name}`;
      const astroColorWithTheme = colorTokens.get(astroColorNameWithTheme);
      pass = astroColor?.id === astroColorWithTheme?.id ? true : false;
      message = pass
        ? `Node is using a fill style (${astroColor.name}) from Astro but it's not the correct theme (${theme})`
        : `Node is using a fill style (${astroColor.name}) from Astro in the correct theme (${theme})`;
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
