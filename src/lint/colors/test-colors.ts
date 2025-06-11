import { addResult } from "../collect-data/results";
import { AstroComponent } from "../../types/astro";
import { astroFillIsUsingCorrectTheme } from "./tests/fills/astro-fill-is-using-correct-theme";
import { astroStrokeIsUsingCorrectTheme } from "./tests/strokes/astro-stroke-is-using-correct-theme";
import { AstroTheme } from "../../types/tokens";
import { TestableNode } from "../../types/figma";
import { LintingResult } from "../../types/results";
import { usingAstroFill } from "./tests/fills/using-astro-fill";
import { usingAstroStroke } from "./tests/strokes/using-astro-stroke";
import { usingFillFromComponent } from "./tests/fills/using-fill-from-component";
import { usingStrokeFromComponent } from "./tests/strokes/using-stroke-from-component";

const testColors = async (
  node: TestableNode,
  theme: AstroTheme
): Promise<void> => {
  const colorTestPromises: Promise<LintingResult>[] = [];

  // Fail if node is in a component and not using the correct paint style
  colorTestPromises.push(usingFillFromComponent(node));
  colorTestPromises.push(
    usingStrokeFromComponent(node)
  );
  // Fail if node is not in an Astro component,
  // IS using a fill/stroke style,
  // AND not using an Astro paint style
  colorTestPromises.push(usingAstroFill(node));
  colorTestPromises.push(usingAstroStroke(node));

  // Fail if node is using an Astro paint style but not the correct one for this theme
  colorTestPromises.push(astroFillIsUsingCorrectTheme(node, theme));
  // colorTestPromises.push(astroStrokeIsUsingCorrectTheme(node, theme));

  await Promise.all(colorTestPromises)
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

export { testColors };
