import { AstroTheme } from "../types/tokens";
import { clearResults, getResults } from "./results";
import { FillStyleNode } from "../types/figma";
import {
  findFillStyleNodes,
  getFillStyleNode,
} from "./colors/helpers/type-checks";
import { getSourceAstroComponent } from "./components/get-source-astro-component";
import { testPaintStyle } from "./colors/test-paint-style";
import { collectOverrides } from "./components/collect-overrides";
import { getNearestAstroComponent } from "./components/get-nearest-astro-component";
import { clearInstanceOverrides } from "./overrides";

const lintSelection = async (theme: AstroTheme) => {
  clearResults();
  clearInstanceOverrides();
  const selection = figma.currentPage.selection;
  const fillStyleNodes = findFillStyleNodes(selection);

  // Check if there are any selected nodes
  if (fillStyleNodes.length === 0) {
    figma.notify("No nodes selected");
    figma.ui.postMessage({ type: "lint-results", content: [] });
    return;
  }

  // Collect all the overrides
  const overridesPromises: Promise<boolean | void>[] = [];
  const nearestAstroComponentPromises: Promise<boolean | void>[] = [];
  const lintingPromises: Promise<void>[] = [];

  // collect all nodes to pre-screen
  let childrenToCheckForOverrides: FillStyleNode[] = [];
  for (const selectionNode of fillStyleNodes) {
    if ("findAll" in selectionNode) {
      childrenToCheckForOverrides = selectionNode.findAll((node) => {
        return findFillStyleNodes([node]).length > 0;
      });
    }
  }

  for (const selectionNode of fillStyleNodes) {
    overridesPromises.push(
      collectOverrides(selectionNode).catch((error) => {
        console.error("Error in collectOverrides:", error);
      })
    );
    childrenToCheckForOverrides.map((node) => {
      overridesPromises.push(
        collectOverrides(node).catch((error) => {
          console.error("Error in collectOverrides:", error);
        })
      );
    });
  }

  await Promise.all(overridesPromises).then(() => {
    // collect all nearest Astro components
    for (const selectionNode of fillStyleNodes) {
      nearestAstroComponentPromises.push(
        getNearestAstroComponent(selectionNode).catch((error) => {
          console.error("Error in getNearestAstroComponent:", error);
        })
      );
      childrenToCheckForOverrides.map((node) => {
        nearestAstroComponentPromises.push(
          getNearestAstroComponent(node).catch((error) => {
            console.error("Error in getNearestAstroComponent:", error);
          })
        );
      });
    }
  });

  await Promise.all(nearestAstroComponentPromises).then(() => {
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
  });

  // Wait for all promises to resolve
  await Promise.all(lintingPromises).then(() => {
    const results = getResults();
    figma.ui.postMessage({ type: "lint-results", content: results });
  });
  figma.notify("Linting complete");
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

const lintSingleNode = async (
  node: FillStyleNode,
  theme: AstroTheme
): Promise<void> => {
  return new Promise((resolve) => {
    (async () => {
      // Get relevant data about this node
      // const {
      //   astroComponentMeta,
      //   nearestSourceAstroComponent,
      //   sourceAstroComponent,
      //   sourceCounterpartNode,
      // } = await getSourceAstroComponent(node);

      // await collectOverrides(node);
      // await getNearestAstroComponent(node);

      // Test paint style
      await testPaintStyle(
        node,
        // sourceAstroComponent,
        // nearestSourceAstroComponent,
        // astroComponentMeta,
        // sourceCounterpartNode,
        theme,
      );
      resolve();
    })();
  });
};

// Listen for messages from the UI
export { lintSelection };
