import Color from "colorjs.io";
import { apcaToInterpolatedFont, apcaValidateFont } from "a11y-color-contrast";
import { extractColors } from "extract-colors";
import { decode } from "./decode-image";
import { AnalyzedColor, ContrastResults, Rgba } from "../types/results";

const evaluateContrast = async (
  messageContent: Uint8Array,
  foreRgba: Rgba,
  fontSize: number,
  fontWeight: number
): Promise<ContrastResults> => {
  const bytes = messageContent;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const imageData = await decode(canvas, ctx, bytes);
  const extractedColors = await extractColors(imageData);
  const backgroundColor = new Color(extractedColors[0].hex);
  const foregroundColor = new Color(
    "sRGB",
    [foreRgba.r, foreRgba.g, foreRgba.b],
    foreRgba.a
  );
  const backgroundColorOklch = backgroundColor.to("OKLCH");
  const foregroundColorOklch = foregroundColor.to("OKLCH");
  const contrastApca = backgroundColorOklch.contrast(
    foregroundColorOklch,
    "APCA"
  );
  const contrastWcag = backgroundColorOklch.contrast(
    foregroundColorOklch,
    "WCAG21"
  );
  const apcaInterpolatedFont = apcaToInterpolatedFont(contrastApca);
  const allowedFontSizes = [
    10, 12, 14, 15, 16, 18, 21, 24, 28, 32, 36, 42, 48, 60, 72, 96,
  ] as const;
  const validFontSize = allowedFontSizes.includes(
    fontSize as (typeof allowedFontSizes)[number]
  )
    ? (fontSize as (typeof allowedFontSizes)[number])
    : 16;
  const allowedFontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
  const validFontWeight = allowedFontWeights.includes(fontWeight as typeof allowedFontWeights[number])
    ? (fontWeight as typeof allowedFontWeights[number])
    : 400;
  const apcaValidatedFont = apcaValidateFont(
    contrastApca,
    validFontSize,
    validFontWeight
  ) as Record<number, Record<number, boolean>>;

  // Does this pass WCAG?
  const wcagPass = contrastWcag >= 4.5;

  // Does this pass APCA?
  const apcaPass = apcaValidatedFont[fontSize]?.[validFontWeight] === true;

  const usedColor: AnalyzedColor = {
    r: foregroundColor.r,
    g: foregroundColor.g,
    b: foregroundColor.b,
    a: foregroundColor.alpha,
    hex: foregroundColor.toString({ format: "hex" }),
    rgba: foregroundColor.toString({ format: "rgba" }),
    oklch: foregroundColorOklch.toString({ format: "oklch" }),
  };
  
  const correspondingColor: AnalyzedColor = {
    r: backgroundColor.r,
    g: backgroundColor.g,
    b: backgroundColor.b,
    a: backgroundColor.alpha,
    hex: backgroundColor.toString({ format: "hex" }),
    rgba: backgroundColor.toString({ format: "rgba" }),
    oklch: backgroundColorOklch.toString({ format: "oklch" }),
  };

  const contrastResults: ContrastResults = {
    usedColor,
    correspondingColor,
    contrastApca: Math.round(contrastApca * 1000) / 1000,
    contrastWcag: Math.round(contrastWcag * 1000) / 1000,
    apcaInterpolatedFont,
    apcaValidatedFont,
    wcagPass,
    apcaPass,
  };

  return contrastResults;
};

export { evaluateContrast };
