// import Colorizr from 'Colorizr';
import { TestableNode } from "../../../types/figma";
import { LintingResult } from "../../../types/results";
import { getAssociation } from "../../collect-data/associations";
import { getInstanceOverride } from "../../collect-data/overrides";
import { getColorAndColorType } from "../../colors/helpers/get-color-and-color-type";
import { createRequest } from "../../parsing-promises/contrast-request-manager";
import { UsedColorResult } from "../../colors/helpers/get-color-and-color-type";
import { getTypographyAttributes } from "../../typography/helpers/get-typography-attributes";

const getRgbaFromUsedColor = (usedColorResult: UsedColorResult) => {
  const { usedColor, usedColorType } = usedColorResult;
  if (!usedColor) return null;

  let rgba: { r: number; g: number; b: number; a: number } | null = null;

  switch (usedColorType) {
    case "astroToken":
    case "paintStyle":
      // Handle Paint Style case
      console.log('asdf astroToken: usedColor', usedColor)
      rgba = {
        r: usedColor.paints[0].color.r, 
        g: usedColor.paints[0].color.g, 
        b: usedColor.paints[0].color.b, 
        a: usedColor.paints[0].opacity
      };
      break;
    case "paint":
      // Handle Paint case
      console.log('asdf paint: usedColor', usedColor)
      rgba = {
        r: usedColor.color.r, 
        g: usedColor.color.g, 
        b: usedColor.color.b, 
        a: usedColor.opacity
      };
      break;
    default:
      return null;
  }

  console.log('asdf rgba', rgba)
  return rgba;
};

interface HasSufficientContrast {
  (node: TextNode): Promise<LintingResult>;
}

const hasSufficientContrast: HasSufficientContrast = (node) => {
  return new Promise((resolve) => {
    (async () => {
      const test = "Has Sufficient Contrast";
      const name = node.name;
      const pass = false;
      const message = "";
      const usedColorResult = await getColorAndColorType(node);
      const { usedColor, usedColorType } = usedColorResult;
      const { usedTypography, usedTypographyType } =
      await getTypographyAttributes(node);

      const fontSize = usedTypography?.fontSize || 16;

      // Create a request for the color contrast data
      // This will allow us to wait for the UI thread to send back the data
      // make the text fully transparent to only get the background
      const origOpacity = node.opacity;
      node.opacity = 0.001;
      const bytes = await node.exportAsync({
        format: "PNG",
        constraint: { type: "SCALE", value: 4 },
        contentsOnly: false,
      });
      // restore opacity
      node.opacity = origOpacity;

      const foreRgba = getRgbaFromUsedColor(usedColorResult);
      
      // send the image data to the UI
      // console.group('hasSufficientContrast - COLLECT 1');
        console.log('hasSufficientContrast', node)
        console.log('usedColor, usedColorType', usedColor, usedColorType)
        console.log('usedTypography, usedTypographyType', usedTypography, usedTypographyType)
        console.log('foreRgba', foreRgba)
      // console.groupEnd();
      figma.ui.postMessage({ type: "image", content: bytes, foreRgba, fontSize, nodeId: node.id });

      // createRequest returns a promise that will be resolved when the UI thread
      // sends back a message with the same nodeId.
      const contrastResults = await createRequest<LintingResult>(node.id);
      // console.group('hasSufficientContrast - RETURN');
        console.log('contrastResults', contrastResults)
      // console.groupEnd();

      // const asdf = Colorizr;
      // const colorInstance = new Colorizr('#ff0044');
      // const colorInstance = new Colorizr('#ffffff');
      // const foregroundColor = new Color("slategray")
      // const backgroundColor = result[0]?.hex;
      // console.log('usedColor', usedColor)
      // console.log('colorInstance', colorInstance)
      // console.log('foregroundColor', foregroundColor)
      // console.log('backgroundColor', backgroundColor)

      // const instanceOverrides = getInstanceOverride(node.id);
      // const overriddenFields = instanceOverrides || null;
      // const overriddenFillStyleId =
      //   overriddenFields && overriddenFields.includes("fillStyleId")
      //     ? true
      //     : false;

      // const association = getAssociation(node.id);
      // const astroIconFromLibrary = association?.astroIconFromLibrary;

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
      };

      



      // debugger;

      switch (true) {
        // case !!overriddenFillStyleId: {
        //   // If the usedColor overriding a component default
        //   resolve({
        //     ...testResult,
        //     id: `${test}-1`,
        //     pass: false,
        //     message: "Layer is overriding a fill style from Astro.",
        //   });
        //   break;
        // }

        // case !!usedColor && usedColorType === "astroToken": {
        //   // If the usedColor is a PaintColorToken
        //   resolve({
        //     ...testResult,
        //     id: `${test}-2`,
        //     pass: true,
        //     message: "Layer is using a fill style from Astro.",
        //   });
        //   break;
        // }

        // case !!usedColor && usedColorType === "paintStyle": {
        //   // If the usedColor is a PaintStyle but not an Astro PaintColorToken
        //   // This means the node is using a fill style but not from Astro
        //   resolve({
        //     ...testResult,
        //     id: `${test}-3`,
        //     pass: false,
        //     message: "Layer is using a fill style not from Astro.",
        //   });
        //   break;
        // }

        // case !!usedColor && usedColorType === "paint" && !!astroIconFromLibrary: {
        //   // If the usedColor is a Paint (Figma Paint) but not an Astro PaintColorToken
        //   // This is not a style, just a paint object
        //   resolve({
        //     ...testResult,
        //     id: `${test}-4`,
        //     pass: true,
        //     message: "Layer is using a fill color as used in Astro.",
        //   });
        //   break;
        // }

        // case !!usedColor && usedColorType === "paint" && !astroIconFromLibrary: {
        //   // If the usedColor is a Paint (Figma Paint) but not an Astro PaintColorToken
        //   // This is not a style, just a paint object
        //   resolve({
        //     ...testResult,
        //     id: `${test}-5`,
        //     pass: false,
        //     message: "Layer is using a fill color, not a fill style from Astro.",
        //   });
        //   break;
        // }

        // case !usedColor: {
        //   // If no fill style or fills are present, return null
        //   resolve({
        //     ...testResult,
        //     id: `${test}-6`,
        //     pass: true,
        //     message: "Layer has no fill styles or fills.",
        //   });
        //   break;
        // }

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
