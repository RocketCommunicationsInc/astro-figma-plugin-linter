import type { PaintWithColorName, TestableNode } from './figma';
import { PaintColorToken } from './tokens';

type LintingResultTestType = 'color' | 'typography' | 'contrast';

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

interface ContrastResults {
  textColor: string;
  backgroundColor: string;
  contrastApca: number;
  contrastWcag: number;
  apcaInterpolatedFont: any;
  apcaValidatedFont: Record<number, Record<number, boolean>>;
  wcagPass: boolean;
  apcaPass: boolean;
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type { LintingResult, FilteredField, LintingResultTestType, ContrastResults, Rgba };
