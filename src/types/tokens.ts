interface AstroTheme {
  theme: "light" | "dark";
}

type SolidPaint = {
  type: "SOLID";
  visible: boolean;
  opacity: number;
  blendMode: string;
  color: { r: number; g: number; b: number };
  boundVariables: Record<string, unknown>;
};

type GradientPaint = {
  type: "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND";
  visible: boolean;
  opacity: number;
  blendMode: string;
  gradientStops: {
    color: { r: number; g: number; b: number; a: number };
    position: number;
    boundVariables: Record<string, unknown>;
  }[];
  gradientTransform: number[][];
};

type PaintColorToken = {
  id: string;
  name: string;
  description: string;
  type: "PAINT";
  paints: (SolidPaint | GradientPaint)[];
  key: string;
};

type TokensJSON = {
  "color-tokens": {
    dark: Record<string, PaintColorToken>;
    light: Record<string, PaintColorToken>;
  };
  "type-tokens": {
    dark: Record<string, PaintColorToken>;
    light: Record<string, PaintColorToken>;
  };
  "components": Record<string, unknown>;
  "icons": Record<string, unknown>;
};

export {
  AstroTheme,
  PaintColorToken,
  TokensJSON,
};
