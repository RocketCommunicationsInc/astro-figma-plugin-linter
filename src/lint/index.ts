import { AstroTheme } from "../types/tokens";
import { clearResults, getResults } from "./collect-data/results";
import { TestableNode } from "../types/figma";
import {
  findTestableNodes,
  getTestableNode,
} from "./colors/helpers/type-checks";
import { testColors } from "./colors";
import { collectOverrides } from "./components/collect-overrides";
import { clearInstanceOverrides } from "./collect-data/overrides";
import { collectAssociations } from "./components/collect-associations";
import { clearAssociations } from "./collect-data/associations";

const lintSelection = async (theme: AstroTheme) => {
  clearResults();
  clearInstanceOverrides();
  clearAssociations();
  const selection = figma.currentPage.selection;
  const testableNodes = findTestableNodes(selection);

  // Check if there are any selected nodes
  if (testableNodes.length === 0) {
    figma.notify("No nodes selected");
    figma.ui.postMessage({ type: "lint-results", content: [] });
    return;
  }

  // Collect all the overrides
  const overridesPromises: Promise<boolean | void>[] = [];
  const associationsPromises: Promise<boolean | void>[] = [];
  const lintingPromises: Promise<void>[] = [];

  // collect all nodes to pre-screen
  let childrenToCheckForOverrides: TestableNode[] = [];
  for (const selectionNode of testableNodes) {
    if ("findAll" in selectionNode) {
      childrenToCheckForOverrides = selectionNode
        .findAll((node) => findTestableNodes([node]).length > 0)
        .map((node) => getTestableNode(node))
        .filter((node): node is TestableNode => !!node);
    }
  }

  for (const selectionNode of testableNodes) {
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
    for (const selectionNode of testableNodes) {
      associationsPromises.push(
        collectAssociations(selectionNode).catch((error) => {
          console.error("Error in overridesPromises:", error);
        })
      );
      childrenToCheckForOverrides.map((node) => {
        associationsPromises.push(
          collectAssociations(node).catch((error) => {
            console.error("Error in overridesPromises:", error);
          })
        );
      });
    }
  });

  await Promise.all(associationsPromises).then(() => {
    for (const selectionNode of testableNodes) {
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
  node: TestableNode,
  theme: AstroTheme
): Promise<void> => {
  const lintChildrenPromises: Promise<void>[] = [];
  // Use a type guard to check if the node supports `findAll`
  if ("findAll" in node) {
    const childrenToLint = node.findAll((node) => {
      return findTestableNodes([node]).length > 0;
    });
    childrenToLint.map((node) => {
      const testableNode = getTestableNode(node);
      if (testableNode) {
        lintChildrenPromises.push(lintSingleNode(testableNode, theme));
      }
    });
  }
  await Promise.all(lintChildrenPromises);
};

const lintSingleNode = async (
  node: TestableNode,
  theme: AstroTheme
): Promise<void> => {
  return new Promise((resolve) => {
    (async () => {
      // Test paint style
      await testColors(node, theme);
      resolve();
    })();
  });
};

// Listen for messages from the UI
export { lintSelection };
