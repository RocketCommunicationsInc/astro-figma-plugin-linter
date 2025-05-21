import { FillStyleNode } from "../../types";
import { AstroTheme, LintingResult } from "../types";
import { AstroComponent } from "../components/types";
import {
  usingAstroColor,
  usingColorFromComponent,
  astroColorIsUsingCorrectTheme,
} from "./tests";
import { addResult } from "../results";

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
