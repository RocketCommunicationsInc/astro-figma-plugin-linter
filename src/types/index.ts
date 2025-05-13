type TokensJSON = {
  "color-tokens": {
    dark: Record<string, unknown>;
    light: Record<string, unknown>;
  };
  "type-tokens": Record<string, unknown>;
  "components": Record<string, unknown>;
};

type FillStyleNode =
  | RectangleNode
  | EllipseNode
  | PolygonNode
  | StarNode
  | VectorNode
  | TextNode
  | FrameNode
  | ComponentNode
  | InstanceNode;

interface InheritedStyleField {
  fillStyleId?: string;
  type?: string;
  name?: string;
  // Add other inherited style fields here if needed
}

export {
  TokensJSON,
  FillStyleNode,
  InheritedStyleField,
};
