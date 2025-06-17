import { addResult } from "../collect-data/results";
import { AstroTheme } from "../../types/tokens";
import { LintingResult } from "../../types/results";
import { usingTypeFromComponent } from "./tests/using-type-from-component";
import { usingAstroType } from "./tests/using-astro-type";

const testTypography = async (
  node: TextNode,
  theme: AstroTheme
): Promise<void> => {
  const typographyTestPromises: Promise<LintingResult>[] = [];

  // Fail if node is in a component and not using the correct type style
  typographyTestPromises.push(usingTypeFromComponent(node));
  // Fail if node is not in an Astro component,
  // IS using a type style,
  // AND not using an Astro type style
  typographyTestPromises.push(usingAstroType(node));

  // Fail if node is using an Astro type style but not the correct one for this theme
  // typographyTestPromises.push(astroTypeIsUsingCorrectTheme(node, theme));

  await Promise.all(typographyTestPromises)
    .then((results) => {
      results.forEach((result: LintingResult | undefined) => {
        if (result) {
          addResult(result);
        }
      });
      return Promise.resolve();
    })
    .catch((error) => {
      console.error("Error in testColors:", error);
    });
};

export { testTypography };
