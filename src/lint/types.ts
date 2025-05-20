import type { FillStyleNode } from '../types';

interface LintingResult {
  ignore?: boolean;
  test: string;
  pass: boolean;
  message: string;
  name: string;
  node: FillStyleNode;
  sourceCounterpartNode?: FillStyleNode | null;
}

interface AstroTheme {
  theme: "light" | "dark";
}

export type { LintingResult, AstroTheme };
