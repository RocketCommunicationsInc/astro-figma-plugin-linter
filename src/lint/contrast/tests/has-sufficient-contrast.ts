import { ContrastResults, LintingResult } from "../../../types/results";
import { getColorAndColorType } from "../../colors/helpers/get-color-and-color-type";
import { createContrastRequest } from "../../parsing-promises/contrast-request-manager";
import { getTypographyAttributes } from "../../typography/helpers/get-typography-attributes";
import { getRgbaFromUsedColor } from "../helpers/get-rgba-from-color";
import { getContrastScreenshot } from "../../collect-data/contrast-screenshots";

interface HasSufficientContrast {
  (
    node: TextNode,
    formula: "WCAG" | "APCA"
  ): Promise<LintingResult>;
}

const hasSufficientContrast: HasSufficientContrast = (node, formula = "WCAG") => {
  return new Promise((resolve) => {
    (async () => {
      
      const test = `Has Sufficient Contrast - ${formula}`;
      const contrastTestId = `${node.id}-${formula}`;
      const name = node.name;
      const pass = false;
      const message = "";
      const usedColorResult = await getColorAndColorType(node);
      const { usedTypography } = await getTypographyAttributes(node);

      const fontSize = usedTypography?.fontSize || 16;
      const fontNameObj = usedTypography?.fontName;
      const { family: fontFamily, style: fontStyle } = fontNameObj || { family: "Roboto", style: "Regular" };

      let fontWeight: number;
      let fontItalic: boolean;
      switch (fontStyle) {
        case "Bold":
          fontWeight = 700;
          fontItalic = false;
          break;
        case "Bold Italic":
          fontWeight = 700;
          fontItalic = true;
          break;
        case "Medium":
          fontWeight = 500;
          fontItalic = false;
          break;
        case "Medium Italic":
          fontWeight = 500;
          fontItalic = true;
          break;
        case "Regular":
          fontWeight = 400;
          fontItalic = false;
          break;
        case "Italic":
          fontWeight = 400;
          fontItalic = true;
          break;
        case "Light":
          fontWeight = 300;
          fontItalic = false;
          break;
        case "Light Italic":
          fontWeight = 300;
          fontItalic = true;
          break;
        default:
          fontWeight = 400;
          fontItalic = false;
      }

      // Create a request for the color contrast data
      // This will allow us to wait for the UI thread to send back the data
      // get a saved screenshot
      const contrastScreenshot = getContrastScreenshot(node.id);

      const foreRgba = getRgbaFromUsedColor(usedColorResult);
      
      // send the image data to the UI
      figma.ui.postMessage({ type: "image", content: contrastScreenshot, foreRgba, fontSize, fontWeight, testId: contrastTestId });

      // createRequest returns a promise that will be resolved when the UI thread

      // sends back a message with the same contrastTestId.
      const contrastResults: ContrastResults = await createContrastRequest(contrastTestId);
      const { 
        usedColor, 
        correspondingColor,
        contrastApca,
        contrastWcag,
        apcaInterpolatedFont,
        apcaValidatedFont,
        wcagPass,
        apcaPass
      } = contrastResults;


      const testResult: LintingResult = {
        test,
        id: `${test}-0`,
        testType: "contrast",
        pass,
        message,
        name,
        node,
        nodeType: node.type,
        usedColor,
        correspondingColor,
        correspondingColorStatus: `${fontFamily}/${fontSize}px weight:${fontWeight}`,
        contrastTypography: {
          fontSize,
          fontWeight,
          fontFamily,
          fontItalic,
          apcaInterpolatedFont,
          apcaValidatedFont
        }
      };

      switch (true) {
        case formula === "WCAG" && !!wcagPass: {
          resolve({
            ...testResult,
            id: `${test}-1`,
            pass: true,
            message: `Text is passing WCAG color contrast with a ratio of ${contrastWcag}.`,
            contrastTypography: undefined // no need to return contrastTypography for WCAG,
          });
          break;
        }

        case formula === "WCAG" && !wcagPass: {
          resolve({
            ...testResult,
            id: `${test}-2`,
            pass: false,
            message: `Text is failing WCAG color contrast with a ratio of ${contrastWcag}.`,
            contrastTypography: undefined // no need to return contrastTypography for WCAG
          });
          break;
        }

        case formula === "APCA" && !!apcaPass: {
          resolve({
            ...testResult,
            id: `${test}-3`,
            pass: true,
            message: `Text is passing APCA color contrast with a ratio of ${contrastApca}.`,
          });
          break;
        }

        case formula === "APCA" && !apcaPass: {
          resolve({
            ...testResult,
            id: `${test}-4`,
            pass: false,
            message: `Text is failing APCA color contrast with a ratio of ${contrastApca}.`,
          });
          break;
        }

        default: {
          resolve({
            ...testResult,
            message: `An unexpected error occurred when linting contrast`,
          });
        }
      }
    })();
  });
};

export { hasSufficientContrast };
