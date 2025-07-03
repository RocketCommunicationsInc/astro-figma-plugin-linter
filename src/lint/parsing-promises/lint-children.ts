import { TestableNode } from "../../types/figma";
import { AstroTheme } from "../../types/tokens";
import { findTestableNodes, getTestableNode } from "../colors/helpers/type-checks";
import { lintSingleNode } from "./lint-single.node";

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

export { lintChildren };
