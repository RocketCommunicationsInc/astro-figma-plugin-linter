import { TestableNode } from "../../../types/figma";

// Return the node or null if it is a TestableNode
const getTestableNode = (node: SceneNode): TestableNode | null => {
  if (canNodeBeTested(node)) {
    return node as TestableNode;
  }
  return null;
}

const findTestableNodes = (nodes: readonly SceneNode[]): TestableNode[] => {
  return nodes.filter((node): node is TestableNode =>
    canNodeBeTested(node)
  );
};

const canNodeBeTested = (node: SceneNode): boolean => {
  // List of node types that support fillStyleId
  const testableNodeTypes: NodeType[] = [
    "RECTANGLE",
    "ELLIPSE",
    "POLYGON",
    "STAR",
    "VECTOR",
    "TEXT",
    "FRAME",
    "COMPONENT",
    "INSTANCE",
    "BOOLEAN_OPERATION",
    "GROUP",
  ];

  return testableNodeTypes.includes(node.type);
};

export { findTestableNodes, canNodeBeTested, getTestableNode };
