import { AstroTheme } from "../types/tokens";
import { clearResults, getResults } from "./collect-data/results";
import { findTestableNodes } from "./colors/helpers/type-checks";
import { clearInstanceOverrides } from "./collect-data/overrides";
import { clearAssociations } from "./collect-data/associations";
import { getChildrenToCheckForOverrides } from "./parsing-promises/get-children-to-check-for-overrides";
import { collectAllOverrides } from "./parsing-promises/collect-all-overrides";
import { collectAllAssociations } from "./parsing-promises/collect-all-associations";
import { lintAllNodes } from "./parsing-promises/lint-all-nodes";

const lintSelection = async (theme: AstroTheme) => {
  clearResults();
  clearInstanceOverrides();
  clearAssociations();

  const selection = figma.currentPage.selection;
  const testableNodes = findTestableNodes(selection);

  if (testableNodes.length === 0) {
    figma.notify("No nodes selected");
    figma.ui.postMessage({ type: "lint-results", content: [] });
    return;
  }

  const childrenToCheckForOverrides = getChildrenToCheckForOverrides(testableNodes);

  await collectAllOverrides(testableNodes, childrenToCheckForOverrides);
  await collectAllAssociations(testableNodes, childrenToCheckForOverrides);
  await lintAllNodes(testableNodes, theme);

  const results = getResults();
  figma.ui.postMessage({ type: "lint-results", content: results });
  figma.notify("Linting complete");
};

export { lintSelection };
