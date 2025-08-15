import Color from "colorjs.io";
import { apcaToInterpolatedFont, apcaValidateFont } from "a11y-color-contrast";
import { extractColors } from "extract-colors";
import { decode } from "./decode-image";
import { ContrastResults, Rgba } from "../types/results";

const evaluateContrast = async (
  messageContent: Uint8Array,
  foreRgba: Rgba,
  fontSize: number
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
  const backgroundColorOKHL = backgroundColor.to("OKLCH");
  const foregroundColorOKHL = foregroundColor.to("OKLCH");
  const contrastApca = backgroundColorOKHL.contrast(
    foregroundColorOKHL,
    "APCA"
  );
  const contrastWcag = backgroundColorOKHL.contrast(
    foregroundColorOKHL,
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
  const apcaValidatedFont = apcaValidateFont(
    contrastApca,
    validFontSize,
    400
  ) as Record<number, Record<number, boolean>>;

  // Does this pass WCAG?
  const wcagPass = contrastWcag >= 4.5;

  // Does this pass APCA?
  const apcaPass = apcaValidatedFont[fontSize]?.[400] === true;

  const contrastResults: ContrastResults = {
    textColor: foregroundColor.toString({ format: "hex" }),
    backgroundColor: backgroundColor.toString({ format: "hex" }),
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
