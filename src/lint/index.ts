import { AstroTheme } from "../types/tokens";
import { clearResults, getResults } from "./results";
import { FillStyleNode } from "../types/figma";
import {
  findFillStyleNodes,
  getFillStyleNode,
} from "./colors/helpers/type-checks";
import { getSourceAstroComponent } from "./components/get-source-astro-component";
import { testPaintStyle } from "./colors/test-paint-style";

const lintSingleNode = async (
  node: FillStyleNode,
  theme: AstroTheme
): Promise<void> => {
  return new Promise((resolve) => {
    (async () => {
      // Get relevant data about this node
      const {
        astroComponentMeta,
        instanceOverrides,
        nearestSourceAstroComponent,
        sourceAstroComponent,
        sourceCounterpartNode,
      } = await getSourceAstroComponent(node);

      // Test paint style
      await testPaintStyle(
        node,
        sourceAstroComponent,
        nearestSourceAstroComponent,
        astroComponentMeta,
        sourceCounterpartNode,
        theme
      );
      resolve();
    })();
  });
};

const lintChildren = async (
  node: FillStyleNode,
  theme: AstroTheme
): Promise<void> => {
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
  await Promise.all(lintChildrenPromises);
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
  for (const selectionNode of fillStyleNodes) {
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
  }

  // Wait for all promises to resolve
  await Promise.all(lintingPromises).then(() => {
    const results = getResults();
    figma.ui.postMessage({ type: "lint-results", content: results });
  });
  figma.notify("Linting complete");
};

// Listen for messages from the UI
export { lintSelection };
