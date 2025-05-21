import type { FillStyleNode } from './figma';

interface LintingResult {
  ignore?: boolean;
  test: string;
  pass: boolean;
  message: string;
  name: string;
  node: FillStyleNode;
  sourceCounterpartNode?: FillStyleNode | null;
}

export type { LintingResult };
