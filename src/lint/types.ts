import type { FillStyleNode } from '../types';

interface LintingResult {
  test: string;
  pass: boolean;
  message: string;
  name: string;
  node: FillStyleNode;
  sourceCounterpartNode?: FillStyleNode | null;
}

export type { LintingResult };
