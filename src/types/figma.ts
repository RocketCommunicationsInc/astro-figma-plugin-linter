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

type PaintWithColorName = Paint & { colorName?: string };

export { TestableNode, PaintWithColorName };
