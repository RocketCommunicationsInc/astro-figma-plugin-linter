import { FillStyleNode } from "../../types";
import { stripToLoadableId } from "../../tokens";
import { tokens } from "../../tokens";
const { colorTokens } = tokens();

const testIfUsingColorFromComponent = (
  node: FillStyleNode,
  sourceCounterpartNode,
) => {
  let fillMatchesAstroSource

  if (sourceCounterpartNode) {
    // Is this node using a paint style in the source Astro component?
    const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
    const sourceFillStyleId =
      "fillStyleId" in sourceCounterpartNode
        ? sourceCounterpartNode.fillStyleId
        : undefined;
    fillMatchesAstroSource = (fillStyleId === sourceFillStyleId);
  }
  return {
    pass: fillMatchesAstroSource,
    message: `Node should be using a fill style from the source Astro component: ${sourceCounterpartNode.name}`,
    sourceCounterpartNode: sourceCounterpartNode,
  };
};

const testIfUsingAstroColor = (fillStyleId: string) => {
  let isUsingAstroColor = false;
  if (fillStyleId) {
    isUsingAstroColor = colorTokens.get(stripToLoadableId(fillStyleId)) ? true : false;
  }
  return {
    pass: isUsingAstroColor,
    message: `Node should be using a fill style from Astro`,
  }
};

const testPaintStyle = (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null,
  astroComponentMeta,
  sourceCounterpartNode
) => {

  // Fail if node is in a component and not using the correct paint style
  if (sourceCounterpartNode) {
    const isUsingColorFromComponent = testIfUsingColorFromComponent(
      node,
      sourceCounterpartNode
    );
    console.warn(
      "node is in a component and using the correct paint style",
      `Source Component: ${sourceCounterpartNode.name}`,
      isUsingColorFromComponent,
    );
  } else {
    // Fail if node is not in an Astro component,
    // IS using a fill style,
    // AND not using an Astro paint style
    const fillStyleId = node.fillStyleId;
    const isUsingAstroColorIfUsingColor =
      typeof fillStyleId === "string" ? testIfUsingAstroColor(fillStyleId) : false;
    console.warn(
      "node is using an Astro paint style if using color",
      isUsingAstroColorIfUsingColor
    );
  }

  // todo: Fail if node is using an Astro paint style but not the correct one for this theme
};

export { testPaintStyle };
