import type { PaintWithColorName, TestableNode } from './figma';
import { PaintColorToken } from './tokens';

interface LintingResult {
  ignore?: boolean;
  test: string;
  id: string;
  pass: boolean;
  message: string;
  name: string;
  node: TestableNode;
  type: string;
  directLibraryCounterpartNode?: TestableNode | null;
  usedColor?: PaintColorToken | Paint;
  correspondingColor?: PaintColorToken | PaintWithColorName | undefined;
  correspondingColorStatus?: string;
  usedTypography?: TextStyle | StyledTextSegment;
  correspondingTypography?: TextStyle | StyledTextSegment;
  correspondingTypographyStatus?: string;
}

export type { LintingResult };
