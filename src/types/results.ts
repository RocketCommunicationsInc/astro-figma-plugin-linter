import type { PaintWithColorName, TestableNode } from './figma';
import { PaintColorToken } from './tokens';

type LintingResultTestType = 'color' | 'typography';

interface LintingResult {
  ignore?: boolean;
  test: string;
  id: string;
  testType: LintingResultTestType;
  pass: boolean;
  message: string;
  name: string;
  node: TestableNode;
  nodeType: string;
  directLibraryCounterpartNode?: TestableNode | null;
  usedColor?: PaintColorToken | Paint;
  correspondingColor?: PaintColorToken | PaintWithColorName | undefined;
  correspondingColorStatus?: string;
  usedTypography?: TextStyle | StyledTextSegment;
  correspondingTypography?: TextStyle | StyledTextSegment;
  correspondingTypographyStatus?: string;
}

type FilteredField = "id" | "nodeType" | "testType";

export type { LintingResult, FilteredField, LintingResultTestType };
