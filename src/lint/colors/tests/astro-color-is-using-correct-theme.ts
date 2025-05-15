import { FillStyleNode } from "../../../types";
import { LintingResult, AstroTheme } from "../../types";
import { stripToLoadableId } from "../../../tokens";
import { tokens } from "../../../tokens";
const { colorTokens } = tokens();

const astroColorIsUsingCorrectTheme = (
  node: FillStyleNode,
  theme: AstroTheme
): LintingResult => {
  const test = "astroColorIsUsingCorrectTheme";
  const name = node.name;
  const fillStyleId = (node.fillStyleId as string) || "";
  const astroColor = colorTokens.get(stripToLoadableId(fillStyleId));
  const astroColorNameWithTheme = `${theme}/${astroColor?.name}`;
  const astroColorWithTheme = colorTokens.get(astroColorNameWithTheme);
  const pass = (astroColor?.id === astroColorWithTheme?.id) ? true : false;
  const message = (pass) ?
    `Node is using a fill style (${astroColor.name}) from Astro but it's not the correct theme (${theme})` :
    `Node is using a fill style (${astroColor.name}) from Astro in the correct theme (${theme})`;
  return {
    test,
    pass,
    message,
    name,
    node,
  };
}

export { astroColorIsUsingCorrectTheme }
