import { TestableNode } from "../../types/figma";
import { AstroTheme } from "../../types/tokens";
import { lintSingleNode } from "./lint-single.node";

interface LintAllNodes {
  (allNodesToLint: TestableNode[], theme: AstroTheme): Promise<void>;
}

const lintAllNodes: LintAllNodes = async (allNodesToLint, theme) => {
  const promises: Promise<void>[] = [];
  for (const node of allNodesToLint) {
    promises.push(lintSingleNode(node, theme).catch(console.error));
  }
  await Promise.all(promises);
};

export { lintAllNodes };
