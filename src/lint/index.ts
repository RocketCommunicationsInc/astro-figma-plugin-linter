import { FillStyleNode } from "../types";
import { getSourceAstroComponent } from "./components";
import { findFillStyleNodes, testPaintStyle } from "./colors";
import { getFillStyleNode } from "./colors/helpers";

const lintSingleNode = async (node: FillStyleNode) => {
  // console.log("lintSingleNode", node);

  // Check if the node is a valid type
  // Is this node part of an Astro component?
  let sourceAstroComponent = null;
  let astroComponentMeta = undefined;
  let sourceCounterpartNode = null;
  if (node.type === "INSTANCE") {
    ({sourceAstroComponent, astroComponentMeta, sourceCounterpartNode} = await getSourceAstroComponent(node));
  }
  // console.log("sourceAstroComponent", sourceAstroComponent);
  // console.log("astroComponentMeta", astroComponentMeta);
  // console.log("sourceCounterpartNode", sourceCounterpartNode);

  // Test paint style
  testPaintStyle(
    node,
    sourceAstroComponent,
    astroComponentMeta,
    sourceCounterpartNode
  );
};

const lintSelection = async () => {
  console.clear();

  const selection = figma.currentPage.selection;
  const fillStyleNodes = findFillStyleNodes(selection);

  // Check if there are any selected nodes
  if (fillStyleNodes.length === 0) {
    // console.log("No nodes selected");
    return;
  } else if (fillStyleNodes.length === 1) {
    // console.log("Linting single node");
    lintSingleNode(fillStyleNodes[0]);
    // Use a type guard to check if the node supports `findAll`
    if ("findAll" in fillStyleNodes[0]) {
      const childrenToLint = fillStyleNodes[0].findAll((node) => {
        return findFillStyleNodes([node]).length > 0;
      });
      // console.log("childrenToLint", childrenToLint);
      childrenToLint.map((node) => {
        const fillStyleNode = getFillStyleNode(node);
        if (fillStyleNode) {
          lintSingleNode(fillStyleNode);
        }
      });
    }
  } else {
    // Then lint any children
    // todo: this is incomplete. check chidren before failing
    console.log("Linting multiple nodes");
    fillStyleNodes.map((node) => {
      lintSingleNode(node);
    });
  }

  figma.notify("Linting complete");
};
// Listen for messages from the UI
export { lintSelection };
