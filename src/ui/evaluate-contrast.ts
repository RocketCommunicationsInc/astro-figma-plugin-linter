import Color from 'colorjs.io';
import { apcaToInterpolatedFont, apcaValidateFont } from "a11y-color-contrast";
import { extractColors } from "extract-colors"
import { decode } from "./decode-image";


interface ForeRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

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

const evaluateContrast = async (
  messageContent: Uint8Array,
  foreRgba: ForeRgba,
  fontSize: number,
  nodeId: string
): Promise<ContrastResults> => {
  const bytes = messageContent;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imageData = await decode(canvas, ctx, bytes);
  const extractedColors = await extractColors(imageData);
  const backgroundColor = new Color(extractedColors[0].hex)
  const foregroundColor = new Color(
    "sRGB", 
    [
      foreRgba.r, 
      foreRgba.g, 
      foreRgba.b
    ], 
    foreRgba.a);        
  const backgroundColorOKHL = backgroundColor.to('OKLCH');
  const foregroundColorOKHL = foregroundColor.to('OKLCH');
  const contrastApca = backgroundColorOKHL.contrast(foregroundColorOKHL, "APCA");
  const contrastWcag = backgroundColorOKHL.contrast(foregroundColorOKHL, "WCAG21");
  const apcaInterpolatedFont = apcaToInterpolatedFont(contrastApca);
  const apcaValidatedFont = apcaValidateFont(contrastApca, fontSize, 400);

  // Does this pass WCAG?
  const wcagPass = contrastWcag >= 4.5;
  // Does this pass APCA?
  const apcaPass = apcaValidatedFont[fontSize][400] === true;

  const contrastResults: ContrastResults = {
    textColor: foregroundColor.toString({ format: 'hex' }),
    backgroundColor: backgroundColor.toString({ format: 'hex' }),
    contrastApca,
    contrastWcag,
    apcaInterpolatedFont,
    apcaValidatedFont,
    wcagPass,
    apcaPass
  }

  console.group('image message');
    console.groupCollapsed('Show your work');
      // console.log('event.data.pluginMessage', event.data.pluginMessage)
      console.table({
        // 'messageType': messageType,
        'nodeId': nodeId,
        'fontSize': fontSize
      });
      console.table({'foreRgba': foreRgba});
      console.log('imageData', imageData)
      console.log('extractedColors', extractedColors)
      console.log('backgroundColor', backgroundColor)
      console.log('foregroundColor', foregroundColor)
      console.log('backgroundColorOKHL', backgroundColorOKHL)
      console.log('foregroundColorOKHL', foregroundColorOKHL)
      console.log('contrastApca', contrastApca)
      console.log('contrastWcag', contrastWcag)
      console.table({'apcaInterpolatedFont': apcaInterpolatedFont});
      console.log('apcaValidatedFont', apcaValidatedFont);
    console.groupEnd();
    console.log('wcagPass', wcagPass);
    console.log('apcaPass', apcaPass);
  console.groupEnd();

  return contrastResults;
}

export { evaluateContrast }
