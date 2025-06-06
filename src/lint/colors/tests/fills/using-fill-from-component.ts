import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { tokens, stripToLoadableId } from "../../../../tokens";
import { PaintColorToken } from "../../../../types/tokens";
import { findCorrespondingAstroNode } from "../../../components/find-corresponding-astro-node";
import { getInstanceOverride } from "../../../overrides";

const getColorFill = (node: FillStyleNode) => {
  console.log("getColorFill node", node);
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
    // console.log("instanceOverrides", instanceOverrides);
    const {
      overriddenFields,
      sourceCounterpartNode,
      astroComponentMeta,
      sourceAstroComponent,
      nearestSourceAstroComponent,
    } = instanceOverrides || {};

    const usedColor = getColorFill(node);
    const sourceColor = sourceCounterpartNode
      ? getColorFill(sourceCounterpartNode)
      : undefined;

    const correspondingAstroNode = findCorrespondingAstroNode(
      node,
      nearestSourceAstroComponent
    );
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
      sourceCounterpartNode,
      usedColor,
      correspondingColor,
    };

    switch (true) {
      case !!overriddenFields && overriddenFields.includes("fillStyleId"): {
        debugger;
        resolve({
          ...testResult,
          id: `${test}-1`,
          pass: false,
          message:
            "Node is not using the same fill style as the source Astro component.",
        });
        break;
      }

      case (!overriddenFields): {
        debugger;
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
        debugger;
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

    debugger;
    resolve({
      ...testResult,
      message: `An unexpected error occurred when linting fills`,
    });
  });
};

export { usingFillFromComponent };
