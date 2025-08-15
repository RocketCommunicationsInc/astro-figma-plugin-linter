import { UsedColorResult } from "../../colors/helpers/get-color-and-color-type";

const getRgbaFromUsedColor = (usedColorResult: UsedColorResult) => {
  const { usedColor, usedColorType } = usedColorResult;
  if (!usedColor) return null;

  let rgba: { r: number; g: number; b: number; a: number } | null = null;

  switch (usedColorType) {
    case "astroToken":
    case "paintStyle":
      // Handle Paint Style case
      if (
        "paints" in usedColor &&
        Array.isArray(usedColor.paints) &&
        usedColor.paints.length > 0 &&
        usedColor.paints[0].type === "SOLID"
      ) {
        const solidPaint = usedColor.paints[0] as SolidPaint;
        rgba = {
          r: solidPaint.color.r,
          g: solidPaint.color.g,
          b: solidPaint.color.b,
          a: solidPaint.opacity ?? 1
        };
      }
      break;
    case "paint":
      // Handle Paint case
      if ("color" in usedColor && "opacity" in usedColor) {
        rgba = {
          r: usedColor.color.r,
          g: usedColor.color.g,
          b: usedColor.color.b,
          a: usedColor.opacity ?? 1
        };
      }
      break;
    default:
      return null;
  }

  return rgba;
};

export { getRgbaFromUsedColor }
