import { FillStyleNode } from "../../types";

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
  ];

  return fillStyleSupportedTypes.includes(node.type);
};

export { findFillStyleNodes, canNodeHaveFillStyle };
