import { FillStyleNode } from "../../types";
import { AstroTheme, LintingResult } from "../types";
import { AstroComponent } from "../components/types";
import {
  usingAstroColor,
  usingColorFromComponent,
  astroColorIsUsingCorrectTheme,
} from "./tests";
import { addResult } from "../results";

const testPaintStyle = (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null,
  astroComponentMeta: AstroComponent | undefined,
  sourceCounterpartNode: ComponentNode | null,
  theme: AstroTheme
): Promise<void> => {
  const promises: Promise<LintingResult>[] = [];
  // Fail if node is in a component and not using the correct paint style
  if (sourceAstroComponent && sourceCounterpartNode) {
    const isUsingColorFromComponent = usingColorFromComponent(
      node,
      sourceCounterpartNode
    );
    promises.push(isUsingColorFromComponent);
  } else {
    // Fail if node is not in an Astro component,
    // IS using a fill style,
    // AND not using an Astro paint style
    const isUsingAstroColorIfUsingColor = usingAstroColor(node);
    promises.push(isUsingAstroColorIfUsingColor);
  }

  // todo: Fail if node is using an Astro paint style but not the correct one for this theme
  const isAstroColorIsUsingCorrectTheme = astroColorIsUsingCorrectTheme(
    node,
    theme
  );
  promises.push(isAstroColorIsUsingCorrectTheme);

  return Promise.all(promises)
  .then((results) => {
    results.forEach((result: LintingResult | undefined) => {
      if (result) {
      addResult(result);
      }
    });
  })
  .catch((error) => {
    console.error("Error in testPaintStyle:", error);
  });
};

export { testPaintStyle };
