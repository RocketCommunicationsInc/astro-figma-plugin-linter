import { FillStyleNode } from "../../types";
import { stripToLoadableId } from "../../tokens";
import { tokens } from "../../tokens";
const { colorTokens } = tokens();

const testUsingColorFromComponent = (
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

const testUsingAstroColorIfUsingColor = (fillStyleId: string) => {
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

  // todo: Fail if node is in a component and using the correct paint style
  if (sourceAstroComponent) {
    const isUsingColorFromComponent = testUsingColorFromComponent(
      node,
      sourceAstroComponent
    );
    console.warn(
      "node is in a component and using the correct paint style",
      isUsingColorFromComponent
    );
  } else {
    // todo: Fail if node is not in an Astro component,
    // IS using a fill style
    // AND not using an Astro paint style
    const fillStyleId = node.fillStyleId;
    console.log('fillStyleId', fillStyleId)
    const isUsingAstroColorIfUsingColor =
      typeof fillStyleId === "string" ? testUsingAstroColorIfUsingColor(fillStyleId) : false;
    console.warn(
      "node is using an Astro paint style if using color",
      isUsingAstroColorIfUsingColor
    );
  }
};

export { testPaintStyle };
