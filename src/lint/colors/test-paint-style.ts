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

const testPaintStyle = async (
  node: TestableNode,
  theme: AstroTheme
): Promise<void> => {
  const paintStylePromises: Promise<LintingResult>[] = [];

  // Fail if node is in a component and not using the correct paint style
  paintStylePromises.push(usingFillFromComponent(node));
  // paintStylePromises.push(
  //   usingStrokeFromComponent(node, directLibraryCounterpartNode)
  // );
  // Fail if node is not in an Astro component,
  // IS using a fill/stroke style,
  // AND not using an Astro paint style
  // paintStylePromises.push(usingAstroFill(node, nearestLibraryParentAstroComponent));
  // paintStylePromises.push(usingAstroStroke(node));

  // Fail if node is using an Astro paint style but not the correct one for this theme
  // paintStylePromises.push(astroFillIsUsingCorrectTheme(node, theme));
  // paintStylePromises.push(astroStrokeIsUsingCorrectTheme(node, theme));

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
