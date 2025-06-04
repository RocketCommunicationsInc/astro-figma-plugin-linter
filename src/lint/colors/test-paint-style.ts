import { addResult } from "../results";
import { AstroComponent } from "../../types/astro";
import { astroFillIsUsingCorrectTheme } from "./tests/fills/astro-fill-is-using-correct-theme";
import { astroStrokeIsUsingCorrectTheme } from "./tests/strokes/astro-stroke-is-using-correct-theme";
import { AstroTheme } from "../../types/tokens";
import { FillStyleNode } from "../../types/figma";
import { LintingResult } from "../../types/results";
import { usingAstroFill } from "./tests/fills/using-astro-fill";
import { usingAstroStroke } from "./tests/strokes/using-astro-stroke";
import { usingFillFromComponent } from "./tests/fills/using-fill-from-component";
import { usingStrokeFromComponent } from "./tests/strokes/using-stroke-from-component";

const testPaintStyle = async (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null,
  nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null,
  astroComponentMeta: AstroComponent | undefined,
  sourceCounterpartNode: ComponentNode | null,
  theme: AstroTheme,
  instanceOverrides
): Promise<void> => {
  const paintStylePromises: Promise<LintingResult>[] = [];

  // TODO: Use the nearestSourceAstroComponent to determine the
  // todo: correstponding node in a source Astro component

  // Fail if node is in a component and not using the correct paint style
  paintStylePromises.push(usingFillFromComponent(node, sourceCounterpartNode, nearestSourceAstroComponent, instanceOverrides));
  // paintStylePromises.push(
  //   usingStrokeFromComponent(node, sourceCounterpartNode)
  // );
  // Fail if node is not in an Astro component,
  // IS using a fill/stroke style,
  // AND not using an Astro paint style
  // console.log('nearestSourceAstroComponent', node.name, nearestSourceAstroComponent?.name, nearestSourceAstroComponent)
  // paintStylePromises.push(usingAstroFill(node, nearestSourceAstroComponent));
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
