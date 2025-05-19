import { FillStyleNode } from "../types";
import { AstroTheme } from "./types";
import { getSourceAstroComponent } from "./components";
import { findFillStyleNodes, testPaintStyle } from "./colors";
import { getFillStyleNode } from "./colors/helpers";
import { clearResults, getResults } from "./results";

const lintSingleNode = async (node: FillStyleNode, theme: AstroTheme) => {
  // Get relevant data about this node
  let sourceAstroComponent = null;
  let astroComponentMeta = undefined;
  let sourceCounterpartNode = null;
  if (node.type === "INSTANCE") {
    ({ sourceAstroComponent, astroComponentMeta, sourceCounterpartNode } =
      await getSourceAstroComponent(node));
  }

  // Test paint style
  testPaintStyle(
    node,
    sourceAstroComponent,
    astroComponentMeta,
    sourceCounterpartNode,
    theme
  );
};

const lintChildren = async (node: FillStyleNode, theme: AstroTheme) => {
  // Use a type guard to check if the node supports `findAll`
  if ("findAll" in node) {
    const childrenToLint = node.findAll((node) => {
      return findFillStyleNodes([node]).length > 0;
    });
    childrenToLint.map((node) => {
      const fillStyleNode = getFillStyleNode(node);
      if (fillStyleNode) {
        lintSingleNode(fillStyleNode, theme);
      }
    });
  }
};

const lintSelection = async (theme: AstroTheme) => {
  clearResults();
  const selection = figma.currentPage.selection;
  const fillStyleNodes = findFillStyleNodes(selection);

  // Check if there are any selected nodes
  if (fillStyleNodes.length === 0) {
    figma.notify("No nodes selected");
    figma.ui.postMessage({ type: "lint-results", content: [] });
    return;
  }

  const promises: Promise<void>[] = fillStyleNodes.map(async (selectionNode) => {
    await lintSingleNode(selectionNode, theme);
    await lintChildren(selectionNode, theme);
  });

  // Wait for all promises to resolve
  await Promise.all(promises).then(() => {
    const results = getResults();
    console.log("all results", results);
    figma.ui.postMessage({ type: "lint-results", content: results });
  });
  console.log("Linting complete");
  figma.notify("Linting complete");
};

// Listen for messages from the UI
export { lintSelection };
