import { TestableNode } from "../../types/figma";

// Type guard to check if a node is a TestableNode
function isFillStyleNode(node: BaseNode): node is TestableNode {
  // Adjust this check based on the actual structure of TestableNode
  return (
    "fills" in node &&
    "type" in node &&
    typeof (node as Partial<TestableNode>).fills !== "undefined"
  );
}

export { isFillStyleNode };
