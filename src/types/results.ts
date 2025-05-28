import type { FillStyleNode } from './figma';
import { PaintColorToken } from './tokens';

interface LintingResult {
  ignore?: boolean;
  test: string;
  id: string;
  pass: boolean;
  message: string;
  name: string;
  node: FillStyleNode;
  sourceCounterpartNode?: FillStyleNode | null;
  usedColorToken?: PaintColorToken;
  sourceColorToken?: PaintColorToken;
}

export type { LintingResult };
