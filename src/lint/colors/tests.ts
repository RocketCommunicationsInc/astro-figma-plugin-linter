import { FillStyleNode } from "../../types";
import { stripToLoadableId } from "../../tokens";
import { tokens } from "../../tokens";
const { colorTokens } = tokens();

const testIfUsingColorFromComponent = (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null
) => {
  if (sourceAstroComponent) {
    // Is this node using a paint style in the source Astro component?
    const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
    const sourceFillStyleId =
      "fillStyleId" in sourceAstroComponent
        ? sourceAstroComponent.fillStyleId
        : undefined;
    return fillStyleId === sourceFillStyleId;
  }
  return null;
};

const testIfUsingAstroColor = (fillStyleId: string) => {
  if (fillStyleId) {
    return colorTokens.get(stripToLoadableId(fillStyleId)) ? true : false;
  }
  return false;
};

const testPaintStyle = (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null
) => {
  console.log("testPaintStyle", node, sourceAstroComponent);

  // Fail if node is in a component and not using the correct paint style
  if (sourceAstroComponent) {
    const isUsingColorFromComponent = testIfUsingColorFromComponent(
      node,
      sourceAstroComponent
    );
    console.warn(
      "node is in a component and using the correct paint style",
      isUsingColorFromComponent
    );
  } else {
    // Fail if node is not in an Astro component,
    // IS using a fill style,
    // AND not using an Astro paint style
    const fillStyleId = node.fillStyleId;
    console.log('fillStyleId', fillStyleId)
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
