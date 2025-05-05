export type TokensJSON = {
  "color-tokens": {
    dark: Record<string, unknown>;
    light: Record<string, unknown>;
  };
  "type-tokens": Record<string, unknown>;
};

export interface InheritedStyleField {
  fillStyleId?: string;
  // Add other inherited style fields here if needed
}

export function hasInheritedStyleField(
  node: SceneNode,
  field: keyof InheritedStyleField
): node is SceneNode & InheritedStyleField {
  return field in node && typeof node[field] === "string";
}
