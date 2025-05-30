interface AstroTheme {
  theme: "light" | "dark";
}

type TokensJSON = {
  "color-tokens": {
    dark: Record<string, unknown>;
    light: Record<string, unknown>;
  };
  "type-tokens": Record<string, unknown>;
  "components": Record<string, unknown>;
};

export {
  AstroTheme,
  TokensJSON,
};
