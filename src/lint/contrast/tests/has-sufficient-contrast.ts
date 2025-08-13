import { TestableNode } from "../../../types/figma";
import { LintingResult } from "../../../types/results";
import { getAssociation } from "../../collect-data/associations";
import { getInstanceOverride } from "../../collect-data/overrides";
import { getColorAndColorType } from "../../colors/helpers/get-color-and-color-type";
import { createRequest } from "../../parsing-promises/contrast-request-manager";


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
      // send the image data to the UI
      figma.ui.postMessage({ type: "image", content: bytes, nodeId: node.id });

      // createRequest returns a promise that will be resolved when the UI thread
      // sends back a message with the same nodeId.
      const result = await createRequest<LintingResult>(node.id);
      console.log('result', result)

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
