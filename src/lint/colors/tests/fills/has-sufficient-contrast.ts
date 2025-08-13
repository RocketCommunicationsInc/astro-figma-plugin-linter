import { TestableNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { getAssociation } from "../../../collect-data/associations";
import { getInstanceOverride } from "../../../collect-data/overrides";
import { getColorAndColorType } from "../../helpers/get-color-and-color-type";
// import { extractColors } from "extract-colors";
// import { decode as decodeImage } from "image-decode";
// import decode from 'image-decode';
// import { PNG } from "pngjs";
// import getPixels from "get-pixels";
// import { extractColors } from "extract-colors";

const findClosestFill = (
  node: TestableNode
): { color: RGB; type: string } | null => {
  let current: TestableNode | null = node;
  while (current) {
    const fill = current.fills?.[0];
    debugger;
    if (fill) {
      return { color: fill.color, type: fill.type };
    }
    current = current.parent;
  }
  return null;
};

interface HasSufficientContrast {
  (node: TestableNode): Promise<LintingResult>;
}

const hasSufficientContrast: HasSufficientContrast = (node) => {
  return new Promise((resolve) => {
    (async () => {
      const test = "Has Sufficient Contrast";
      const name = node.name;
      const pass = false;
      const message = "";
      const { usedColor, usedColorType } = await getColorAndColorType(node);

      const instanceOverrides = getInstanceOverride(node.id);
      const overriddenFields = instanceOverrides || null;
      const overriddenFillStyleId =
        overriddenFields && overriddenFields.includes("fillStyleId")
          ? true
          : false;

      const association = getAssociation(node.id);
      const astroIconFromLibrary = association?.astroIconFromLibrary;

      const testResult: LintingResult = {
        test,
        id: `${test}-0`,
        testType: "color",
        pass,
        message,
        name,
        node,
        nodeType: node.type,
        usedColor,
      };

      // find the color of whatever is behind this node
      // find the closest parent with a fill
      // const closestFill = findClosestFill(node.parent);

      // Export a 2x resolution PNG of the node
      const origOpacity = node.opacity;
      node.opacity = 0.001;
      const bytes = await node.exportAsync({
        format: "PNG",
        constraint: { type: "SCALE", value: 4},
        contentsOnly: false,
      });
      // Add the image onto the canvas as an image fill in a frame
      const image = figma.createImage(bytes);
      // const frame = figma.createFrame();
      // frame.x = 200;
      // frame.resize(node.width, node.height);
      // frame.fills = [
      //   {
      //     imageHash: image.hash,
      //     scaleMode: "FILL",
      //     scalingFactor: 1,
      //     type: "IMAGE",
      //   },
      // ];
      node.opacity = origOpacity;

      // const backgroundImage: ImageData = new ImageData(
      //   new Uint8ClampedArray(bytes),
      //   node.width,
      //   node.height
      // );

      // console.log('backgroundImage', backgroundImage)


      try {
        // Decode the image bytes to get the pixel data
        // getPixels(bytes, (err, pixels) => {
        //   if(!err) {
        //     const data = [...pixels.data]
        //     const [width, height] = pixels.shape

        //     extractColors({ data, width, height })
        //       .then(console.log)
        //       .catch(console.log)
        //   }
        // })

        // send the image to the ui
        // figma.ui.postMessage({
        //   type: "image",
        //   data: bytes,
        // });
        figma.ui.postMessage({ type: 'image', content: bytes });

        // extractColors(backgroundImage).then(console.log).catch(console.error);
        // const imageData = decodeImage(bytes);
        // let png = new PNG({
        //   width: node.width,
        //   height: node.height,
        //   bitDepth: 16,
        //   colorType: 6,
        //   inputColorType: 6,
        //   inputHasAlpha: true,
        // });
        // console.log('png', png)
        // const imageData = await decode(bytes);
        // console.log('imageData', imageData)
      } catch (error) {
        console.error(error);
      }


      // debugger;

      // switch (true) {
      //   case !!overriddenFillStyleId: {
      //     // If the usedColor overriding a component default
      //     resolve({
      //       ...testResult,
      //       id: `${test}-1`,
      //       pass: false,
      //       message: "Layer is overriding a fill style from Astro.",
      //     });
      //     break;
      //   }

      //   case !!usedColor && usedColorType === "astroToken": {
      //     // If the usedColor is a PaintColorToken
      //     resolve({
      //       ...testResult,
      //       id: `${test}-2`,
      //       pass: true,
      //       message: "Layer is using a fill style from Astro.",
      //     });
      //     break;
      //   }

      //   case !!usedColor && usedColorType === "paintStyle": {
      //     // If the usedColor is a PaintStyle but not an Astro PaintColorToken
      //     // This means the node is using a fill style but not from Astro
      //     resolve({
      //       ...testResult,
      //       id: `${test}-3`,
      //       pass: false,
      //       message: "Layer is using a fill style not from Astro.",
      //     });
      //     break;
      //   }

      //   case !!usedColor && usedColorType === "paint" && !!astroIconFromLibrary: {
      //     // If the usedColor is a Paint (Figma Paint) but not an Astro PaintColorToken
      //     // This is not a style, just a paint object
      //     resolve({
      //       ...testResult,
      //       id: `${test}-4`,
      //       pass: true,
      //       message: "Layer is using a fill color as used in Astro.",
      //     });
      //     break;
      //   }

      //   case !!usedColor && usedColorType === "paint" && !astroIconFromLibrary: {
      //     // If the usedColor is a Paint (Figma Paint) but not an Astro PaintColorToken
      //     // This is not a style, just a paint object
      //     resolve({
      //       ...testResult,
      //       id: `${test}-5`,
      //       pass: false,
      //       message: "Layer is using a fill color, not a fill style from Astro.",
      //     });
      //     break;
      //   }

      //   case !usedColor: {
      //     // If no fill style or fills are present, return null
      //     resolve({
      //       ...testResult,
      //       id: `${test}-6`,
      //       pass: true,
      //       message: "Layer has no fill styles or fills.",
      //     });
      //     break;
      //   }

      //   default: {
      //     resolve({
      //       ...testResult,
      //       message: `An unexpected error occurred when linting fills`,
      //     });
      //   }
      // }
    })();
  });
};

export { hasSufficientContrast };
