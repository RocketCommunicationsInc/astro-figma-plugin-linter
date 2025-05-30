import { addResult } from "../results";
import { astroColorIsUsingCorrectTheme } from "./tests/astro-color-is-using-correct-theme";
import { AstroComponent } from "../../types/astro";
import { AstroTheme } from "../../types/tokens";
import { FillStyleNode } from "../../types/figma";
import { LintingResult } from "../../types/results";
import { usingAstroColor } from "./tests/using-astro-color";
import { usingColorFromComponent } from "./tests/using-color-from-component";

const testPaintStyle = async (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null,
  astroComponentMeta: AstroComponent | undefined,
  sourceCounterpartNode: ComponentNode | null,
  theme: AstroTheme
): Promise<void> => {
  const paintStylePromises: Promise<LintingResult>[] = [];

  // Fail if node is in a component and not using the correct paint style
  if (sourceAstroComponent && sourceCounterpartNode) {
    paintStylePromises.push(usingColorFromComponent(
      node,
      sourceCounterpartNode
    ));
  } else {
    // Fail if node is not in an Astro component,
    // IS using a fill style,
    // AND not using an Astro paint style
    // const isUsingAstroColorIfUsingColor = usingAstroColor(node);
    paintStylePromises.push(usingAstroColor(node));
  }

  // Fail if node is using an Astro paint style but not the correct one for this theme
  paintStylePromises.push(astroColorIsUsingCorrectTheme(
    node,
    theme
  ));

  await Promise.all(paintStylePromises)
    .then((results) => {
      results.forEach((result: LintingResult | undefined) => {
        if (result) {
          addResult(result);
        }
      });
      return Promise.resolve();
    })
    .catch((error) => {
      console.error("Error in testPaintStyle:", error);
    });
};

export { testPaintStyle };
