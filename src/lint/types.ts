import type { FillStyleNode } from '../types';

interface LintingResult {
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
