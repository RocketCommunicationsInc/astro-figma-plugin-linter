import { TestableNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { getInstanceOverride } from "../../../collect-data/overrides";
import { getAssociation } from "../../../collect-data/associations";
import { getColorAndColorType } from "../../helpers/get-color-and-color-type";

interface UsingStrokeFromComponent {
  (node: TestableNode): Promise<LintingResult>;
}

const usingStrokeFromComponent: UsingStrokeFromComponent = (node) => {
  return new Promise((resolve) => {
    (async () => {
      // This test checks if the node is using a stroke style from the source Astro component.
      // It checks for overrides and compares the stroke style with the source Astro component.
      const test = "Using Color Stroke from a Component";
      const name = node.name;
      const pass = false;
      const message = "";
      let correspondingColorStatus: string = "";

      const instanceOverrides = getInstanceOverride(node.id);
      const overriddenFields = instanceOverrides || null;

      const association = getAssociation(node.id);
      const {
        directLibraryCounterpartNode,
        correspondingAstroNodeFromLibrary,
      } = association || {};

      const { usedColor } = await getColorAndColorType(node, "stroke");
      let correspondingColor: typeof usedColor | undefined;
      if (correspondingAstroNodeFromLibrary) {
        const result = await getColorAndColorType(
          correspondingAstroNodeFromLibrary
        );
        correspondingColor = result.usedColor;
      } else {
        correspondingColor = undefined;
      }

      correspondingColorStatus = correspondingAstroNodeFromLibrary
        ? "No stroke or stroke style found in the library Astro component"
        : "Could not determine the stroke style from the library Astro component";

      const testResult: LintingResult = {
        test,
        id: `${test}-0`,
        pass,
        message,
        name,
        node,
        nodeType: node.type,
        directLibraryCounterpartNode,
        usedColor,
        correspondingColor,
        correspondingColorStatus,
      };

      switch (true) {
        case !!overriddenFields && overriddenFields.includes("strokeStyleId"): {
          resolve({
            ...testResult,
            id: `${test}-1`,
            pass: false,
            message:
              "Node is not using the same stroke style as the source Astro component.",
          });
          break;
        }

        case !!overriddenFields && overriddenFields.includes("strokes"): {
          resolve({
            ...testResult,
            id: `${test}-2`,
            pass: false,
            message:
              "Node is not using the same stroke as the source Astro component.",
          });
          break;
        }

        case !overriddenFields: {
          resolve({
            ...testResult,
            id: `${test}-3`,
            pass: true,
            message:
              "Node is using the same stroke style as the source Astro component.",
          });
          break;
        }

        default: {
          resolve({
            ...testResult,
            id: `${test}-4`,
            ignore: true,
            pass: true,
            message: "Something is overridden, but not strokeStyleId.",
          });
          break;
        }
      }
    })();
  });
};

export { usingStrokeFromComponent };
