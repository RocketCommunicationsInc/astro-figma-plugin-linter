import { AstroTheme } from "../types/tokens";
import { clearResults, getResults } from "./collect-data/results";
import { findTestableNodes } from "./colors/helpers/type-checks";
import { clearInstanceOverrides } from "./collect-data/overrides";
import { clearAssociations } from "./collect-data/associations";
import { getChildrenToCheckForOverrides } from "./parsing-promises/get-children-to-check-for-overrides";
import { collectAllOverrides } from "./parsing-promises/collect-all-overrides";
import { collectAllAssociations } from "./parsing-promises/collect-all-associations";
import { lintAllNodes } from "./parsing-promises/lint-all-nodes";
import { collectAllContrastScreenshots } from "./parsing-promises/collect-all-contrast-screenshots";

const lintSelection = async (theme: AstroTheme) => {
  clearResults();
  clearInstanceOverrides();
  clearAssociations();

  const selection = figma.currentPage.selection;
  const testableNodesInSelection = findTestableNodes(selection);

  if (testableNodesInSelection.length === 0) {
    figma.notify("No nodes selected");
    figma.ui.postMessage({ type: "lint-results", content: [] });
    return;
  }

  const allNodesToLint = getChildrenToCheckForOverrides(
    testableNodesInSelection
  );
  testableNodesInSelection.forEach((node) => allNodesToLint.push(node));

  await collectAllOverrides(allNodesToLint);
  await collectAllAssociations(allNodesToLint);
  await collectAllContrastScreenshots(allNodesToLint);
  await lintAllNodes(allNodesToLint, theme);

  const results = getResults();
  figma.ui.postMessage({ type: "lint-results", content: results });
  figma.notify("Linting complete");
};

export { lintSelection };
