import { TestableNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { getInstanceOverride } from "../../../collect-data/overrides";
import { getAssociation } from "../../../collect-data/associations";
import { getColorFill } from "../../helpers/get-color-fill";

interface UsingFillFromComponent {
  (node: TestableNode): Promise<LintingResult>;
}

const usingFillFromComponent: UsingFillFromComponent = (
  node: TestableNode
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Color Fill from a Component";
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

    const usedColor = getColorFill(node);
    const correspondingColor = correspondingAstroNodeFromLibrary
      ? getColorFill(correspondingAstroNodeFromLibrary)
      : undefined;

    correspondingColorStatus = (correspondingAstroNodeFromLibrary) ?
      "No fill or fill style found in the library Astro component" :
      "Could not determine the fill style from the library Astro component";

    const testResult: LintingResult = {
      test,
      id: `${test}-0`,
      pass,
      message,
      name,
      node,
      type: node.type,
      directLibraryCounterpartNode,
      usedColor,
      correspondingColor,
      correspondingColorStatus
    };

    switch (true) {
      case !!overriddenFields && overriddenFields.includes("fillStyleId"): {
        resolve({
          ...testResult,
          id: `${test}-1`,
          pass: false,
          message:
            "Node is not using the same fill style as the source Astro component.",
        });
        break;
      }

      case !!overriddenFields && overriddenFields.includes("fills"): {
        resolve({
          ...testResult,
          id: `${test}-2`,
          pass: false,
          message:
            "Node is not using the same fill as the source Astro component.",
        });
        break;
      }

      case !overriddenFields: {
        resolve({
          ...testResult,
          id: `${test}-3`,
          pass: true,
          message:
            "Node is using the same fill style as the source Astro component.",
        });
        break;
      }

      default: {
        resolve({
          ...testResult,
          id: `${test}-4`,
          ignore: true,
          pass: true,
          message: "Something is overridden, but not fillStyleId.",
        });
        break;
      }
    }
  });
};

export { usingFillFromComponent };
