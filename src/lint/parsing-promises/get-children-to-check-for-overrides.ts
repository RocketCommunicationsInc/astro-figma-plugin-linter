import { TestableNode } from "../../types/figma";
import { canNodeBeTested } from "../colors/helpers/type-checks";

interface GetChildrenToCheckForOverrides {
  (testableNodes: TestableNode[]): TestableNode[];
}

const getChildrenToCheckForOverrides: GetChildrenToCheckForOverrides = (
  testableNodes
) => {
  return testableNodes.flatMap((selectionNode) => {
    if ("findAll" in selectionNode) {
      // Use canNodeBeTested directly for efficiency and correct type casting.
      return selectionNode.findAll(canNodeBeTested) as TestableNode[];
    }
    return [];
  });
};

export { getChildrenToCheckForOverrides };
