import { FillStyleNode } from "../../types";
import { AstroTheme } from "../types";
import { AstroComponent } from "../components/types";
import { usingAstroColor, usingColorFromComponent, astroColorIsUsingCorrectTheme } from "./tests";

const testPaintStyle = (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null,
  astroComponentMeta: AstroComponent | undefined,
  sourceCounterpartNode: ComponentNode | null,
  theme: AstroTheme
) => {
  console.log('sourceAstroComponent', sourceAstroComponent)
  // Fail if node is in a component and not using the correct paint style
  if (sourceAstroComponent && sourceCounterpartNode) {
    const isUsingColorFromComponent = usingColorFromComponent(
      node,
      sourceCounterpartNode
    );
    console.warn("isUsingColorFromComponent", isUsingColorFromComponent);
  } else {
    // Fail if node is not in an Astro component,
    // IS using a fill style,
    // AND not using an Astro paint style
    // const fillStyleId = node.fillStyleId;
    // const isUsingAstroColorIfUsingColor =
    //   typeof fillStyleId === "string" ? usingAstroColor(fillStyleId) : false;
    const isUsingAstroColorIfUsingColor = usingAstroColor(node);
    console.warn(
      "isUsingAstroColorIfUsingColor",
      isUsingAstroColorIfUsingColor
    );
  }

  // todo: Fail if node is using an Astro paint style but not the correct one for this theme
  const isAstroColorIsUsingCorrectTheme =
    astroColorIsUsingCorrectTheme(node, theme);
  console.warn(
    "isAstroColorIsUsingCorrectTheme",
    isAstroColorIsUsingCorrectTheme
  );
};

export { testPaintStyle };
