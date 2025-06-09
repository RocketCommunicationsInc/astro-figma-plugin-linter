import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { tokens, stripToLoadableId } from "../../../../tokens";
import { PaintColorToken } from "../../../../types/tokens";
import { findCorrespondingAstroNode } from "../../../components/find-corresponding-astro-node";
import { getInstanceOverride } from "../../../collect-data/overrides";
import { getAssociation } from "../../../collect-data/associations";

const getColorFill = (node: FillStyleNode) => {
  let color: PaintColorToken | undefined = undefined;
  const { colorTokens } = tokens();
  const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
  if (typeof fillStyleId === "string") {
    color = colorTokens.get(stripToLoadableId(fillStyleId));
  }
  if (!color) {
    // If no fillStyleId, check for fills
    const fills = "fills" in node ? node.fills : undefined;
    if (Array.isArray(fills) && fills.length > 0) {
      const firstFill = fills[0];
      if (firstFill.type === "SOLID") {
        color = {
          type: "SOLID",
          color: firstFill.color,
          opacity: firstFill.opacity,
        };
      }
    }
  }
  return color;
};

interface UsingFillFromComponent {
  (node: FillStyleNode): Promise<LintingResult>;
}

const usingFillFromComponent: UsingFillFromComponent = (
  node
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Color Fill from a Component";
    const name = node.name;
    const pass = false;
    const message = "";

    const instanceOverrides = getInstanceOverride(node.id);
    const overriddenFields = instanceOverrides || null;

    const {
      directLibraryCounterpartNode,
      astroComponentMeta,
      astroComponentFromLibrary,
      nearestLibraryParentAstroComponent,
    } = getAssociation(node.id);

    const usedColor = getColorFill(node);
    const sourceColor = directLibraryCounterpartNode
      ? getColorFill(directLibraryCounterpartNode)
      : undefined;

    const correspondingAstroNode = findCorrespondingAstroNode(node);
    const correspondingColor = correspondingAstroNode
      ? getColorFill(correspondingAstroNode)
      : undefined;

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

      case !overriddenFields: {
        resolve({
          ...testResult,
          id: `${test}-2`,
          pass: true,
          message:
            "Node is using the same fill style as the source Astro component.",
        });
        break;
      }

      default: {
        resolve({
          ...testResult,
          id: `${test}-3`,
          ignore: true,
          pass: true,
          message: "Something is overridden, but not fillStyleId.",
        });
        break;
      }
    }

    resolve({
      ...testResult,
      message: `An unexpected error occurred when linting fills`,
    });
  });
};

export { usingFillFromComponent };
