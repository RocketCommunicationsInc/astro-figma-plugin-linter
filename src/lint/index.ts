import { FillStyleNode } from "../types";
import { getSourceAstroComponent } from "./components";
import { findFillStyleNodes, testPaintStyle } from "./colors";

const lintSingleNode = async (node: FillStyleNode) => {
  console.log("lintSingleNode", node);

  // Check if the node is a valid type
  // Is this node part of an Astro component?
  let sourceAstroComponent: ComponentNode | ComponentSetNode | null = null;
  if (node.type === "INSTANCE") {
    sourceAstroComponent = await getSourceAstroComponent(node);
  }
  console.log("sourceAstroComponent", sourceAstroComponent);

  // Test paint style
  const passUsingPaintStyle = testPaintStyle(node, sourceAstroComponent);
  console.log("passUsingPaintStyle", passUsingPaintStyle);
};

const lintSelection = async () => {
  console.clear();

  const selection = figma.currentPage.selection;
  const fillStyleNodes = findFillStyleNodes(selection);

  // Check if there are any selected nodes
  if (fillStyleNodes.length === 0) {
    console.log("No nodes selected");
    return;
  } else if (fillStyleNodes.length === 1) {
    console.log("Linting single node");
    lintSingleNode(fillStyleNodes[0]);
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
