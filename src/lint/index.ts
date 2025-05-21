import { FillStyleNode } from "../types";
import { AstroTheme } from "./types";
import { getSourceAstroComponent } from "./components";
import { findFillStyleNodes, testPaintStyle } from "./colors";
import { getFillStyleNode } from "./colors/helpers";
import { clearResults, getResults } from "./results";

const lintSingleNode = async (node: FillStyleNode, theme: AstroTheme) => {
  return new Promise((resolve) => {
    (async () => {
      // Get relevant data about this node
      const { sourceAstroComponent, astroComponentMeta, sourceCounterpartNode } =
        await getSourceAstroComponent(node);

      // Test paint style
      resolve(
        testPaintStyle(
          node,
          sourceAstroComponent,
          astroComponentMeta,
          sourceCounterpartNode,
          theme
        )
      );
    })();
  });
};

const lintChildren = async (node: FillStyleNode, theme: AstroTheme) => {
  const lintChildrenPromises: Promise<void>[] = [];
  // Use a type guard to check if the node supports `findAll`
  if ("findAll" in node) {
    const childrenToLint = node.findAll((node) => {
      return findFillStyleNodes([node]).length > 0;
    });
    childrenToLint.map((node) => {
      const fillStyleNode = getFillStyleNode(node);
      if (fillStyleNode) {
        lintChildrenPromises.push(lintSingleNode(fillStyleNode, theme));
      }
    });
  }
  return Promise.all(lintChildrenPromises);
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

  const lintingPromises: Promise<void>[] = [];
  await fillStyleNodes.map(async (selectionNode) => {
    lintingPromises.push(
      lintSingleNode(selectionNode, theme).catch((error) => {
        console.error("Error in lintSingleNode:", error);
      })
    );
    lintingPromises.push(
      lintChildren(selectionNode, theme).catch((error) => {
        console.error("Error in lintChildren:", error);
      })
    );
  });

  // Wait for all promises to resolve
  await Promise.all(lintingPromises).then(() => {
    const results = getResults();
    figma.ui.postMessage({ type: "lint-results", content: results });
  });
  console.log("Linting complete");
  figma.notify("Linting complete");
};

// Listen for messages from the UI
export { lintSelection };
