import { TestableNode } from "../../types/figma";
import { lintChildren } from "./lint-children";
import { lintSingleNode } from "./lint-single.node";

async function lintAllNodes(testableNodes: TestableNode[], theme: AstroTheme) {
  const promises: Promise<void>[] = [];
  for (const node of testableNodes) {
    promises.push(lintSingleNode(node, theme).catch(console.error));
    promises.push(lintChildren(node, theme).catch(console.error));
  }
  await Promise.all(promises);
}

export { lintAllNodes };
