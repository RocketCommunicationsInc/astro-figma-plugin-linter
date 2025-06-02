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
  type: string;
  sourceCounterpartNode?: FillStyleNode | null;
  usedColor?: PaintColorToken | PaintStyle | Paint;
  sourceColor?: PaintColorToken;
}

export type { LintingResult };
