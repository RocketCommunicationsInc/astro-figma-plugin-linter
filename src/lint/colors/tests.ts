import { FillStyleNode } from "../../types";

const testUsingSameFillStyleAsAstroComponent = (
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
    return (fillStyleId === sourceFillStyleId);
  }
  return null;
};

const testPaintStyle = (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null
) => {
  console.log("testPaintStyle", node, sourceAstroComponent);

  // todo: Fail if node is in a component and using the correct paint style
  if (sourceAstroComponent) {
    const isInComponentAndCorrectPaintStyle = testUsingSameFillStyleAsAstroComponent(
      node,
      sourceAstroComponent
    );
    console.warn("node is in a component and using the correct paint style", isInComponentAndCorrectPaintStyle);
  }
};

export { testPaintStyle };
