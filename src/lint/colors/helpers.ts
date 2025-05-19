import { FillStyleNode } from "../../types";

// Return the node or null if it is a fillStyleNode
const getFillStyleNode = (node: SceneNode): FillStyleNode | null => {
  if (canNodeHaveFillStyle(node)) {
    return node as FillStyleNode;
  }
  return null;
}

const findFillStyleNodes = (nodes: readonly SceneNode[]): FillStyleNode[] => {
  return nodes.filter((node): node is FillStyleNode =>
    canNodeHaveFillStyle(node)
  );
};

const canNodeHaveFillStyle = (node: SceneNode): boolean => {
  // List of node types that support fillStyleId
  const fillStyleSupportedTypes: NodeType[] = [
    "RECTANGLE",
    "ELLIPSE",
    "POLYGON",
    "STAR",
    "VECTOR",
    "TEXT",
    "FRAME",
    "COMPONENT",
    "INSTANCE",
    "BOOLEAN_OPERATION"
  ];

  return fillStyleSupportedTypes.includes(node.type);
};

export { findFillStyleNodes, canNodeHaveFillStyle, getFillStyleNode };
