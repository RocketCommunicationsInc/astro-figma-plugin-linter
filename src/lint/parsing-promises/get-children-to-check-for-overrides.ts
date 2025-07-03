import { TestableNode } from "../../types/figma";
import { findTestableNodes, getTestableNode } from "../colors/helpers/type-checks";

function getChildrenToCheckForOverrides(testableNodes: TestableNode[]): TestableNode[] {
  let children: TestableNode[] = [];
  for (const selectionNode of testableNodes) {
    if ("findAll" in selectionNode) {
      children = selectionNode
        .findAll((node) => findTestableNodes([node]).length > 0)
        .map((node) => getTestableNode(node))
        .filter((node): node is TestableNode => !!node);
    }
  }
  return children;
}

export { getChildrenToCheckForOverrides };
