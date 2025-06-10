type TestableNode =
  | (RectangleNode & BaseNodeMixin)
  | (EllipseNode & BaseNodeMixin)
  | (PolygonNode & BaseNodeMixin)
  | (StarNode & BaseNodeMixin)
  | (VectorNode & BaseNodeMixin)
  | (TextNode & BaseNodeMixin)
  | (FrameNode & BaseNodeMixin)
  | (ComponentNode & BaseNodeMixin)
  | (InstanceNode & BaseNodeMixin)
  | (BooleanOperationNode & BaseNodeMixin);

interface InheritedStyleField {
  fillStyleId?: string;
  type?: string;
  name?: string;
  // Add other inherited style fields here if needed
}

export {
  TestableNode,
  InheritedStyleField,
};
