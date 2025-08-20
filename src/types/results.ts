import type { PaintWithColorName, TestableNode } from './figma';
import { PaintColorToken } from './tokens';

type LintingResultTestType = 'color' | 'typography' | 'contrast';

type ContrastTypography = {
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  fontItalic: boolean;
  apcaInterpolatedFont?: Record<number, number | "placeholder">;
  apcaValidatedFont?: Record<number, Record<number, boolean>>;
};

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
  usedColor?: PaintColorToken | Paint | AnalyzedColor;
  correspondingColor?: PaintColorToken | PaintWithColorName | AnalyzedColor | undefined;
  correspondingColorStatus?: string;
  usedTypography?: TextStyle | StyledTextSegment;
  correspondingTypography?: TextStyle | StyledTextSegment;
  correspondingTypographyStatus?: string;
  contrastTypography?: ContrastTypography;
}

type FilteredField = "id" | "nodeType" | "testType";

type AnalyzedColor = {
  r: number;
  g: number;
  b: number;
  a: number;
  rgba: string;
  oklch: string;
  hex: string;
};

interface ContrastResults {
  usedColor: AnalyzedColor;
  correspondingColor: AnalyzedColor;
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

export type { ContrastTypography, LintingResult, FilteredField, LintingResultTestType, ContrastResults, Rgba, AnalyzedColor };
