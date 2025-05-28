interface AstroTheme {
  theme: "light" | "dark";
}

type PaintColorToken = {
  id: string;
  name: string;
  description: string;
  type: "PAINT";
  paints: Array<{
    type: "SOLID";
    visible: boolean;
    opacity: number;
    blendMode: string;
    color: {
      r: number;
      g: number;
      b: number;
    };
    boundVariables: Record<string, unknown>;
  }>;
  key: string;
};

type TokensJSON = {
  "color-tokens": {
    dark: Record<string, PaintColorToken>;
    light: Record<string, PaintColorToken>;
  };
  "type-tokens": Record<string, unknown>;
  "components": Record<string, unknown>;
};

export {
  AstroTheme,
  PaintColorToken,
  TokensJSON,
};
