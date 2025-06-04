import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { tokens, stripToLoadableId } from "../../../../tokens";
import { PaintColorToken } from "../../../../types/tokens";
import { findCorrespondingAstroNode } from "../../../components/find-corresponding-astro-node";
import { getInstanceOverride } from "../../../overrides";

interface UsingFillFromComponent {
  (
    node: FillStyleNode,
    sourceCounterpartNode: FillStyleNode | null,
    nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null
  ): Promise<LintingResult>;
}

const usingFillFromComponent: UsingFillFromComponent = (
  node,
  sourceCounterpartNode,
  nearestSourceAstroComponent,
  instanceOverrides
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Color Fill from a Component";
    const name = node.name;
    const pass = false;
    const message = "";

    const scn = sourceCounterpartNode;
    const nsac = nearestSourceAstroComponent;
    const io = instanceOverrides;
    const instanceOverridesFROMMAP = getInstanceOverride(node.id);
    console.log("scn, nsac, io", scn, nsac, io, instanceOverridesFROMMAP);
    debugger;
    const correspondingAstroNode = findCorrespondingAstroNode(
      node,
      nearestSourceAstroComponent,
    );
    const correspondingAstroNodeSCN = findCorrespondingAstroNode(
      node,
      sourceCounterpartNode,
    );
    console.log('correspondingAstroNode', node.name, node.id, correspondingAstroNode)
    console.log('correspondingAstroNodeSCN', node.name, node.id, correspondingAstroNodeSCN)

    const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
    const sourceFillStyleId =
      sourceCounterpartNode && "fillStyleId" in sourceCounterpartNode
        ? sourceCounterpartNode.fillStyleId
        : undefined;
    const correspondingFillStyleId =
      correspondingAstroNode && "fillStyleId" in correspondingAstroNode
        ? correspondingAstroNode.fillStyleId
        : undefined;


    const { colorTokens } = tokens();

    let usedColor,
      sourceColor: PaintColorToken | undefined = undefined,
      correspondingColor: PaintColorToken | undefined = undefined;
    if (typeof fillStyleId === "string") {
      usedColor = colorTokens.get(stripToLoadableId(fillStyleId));
    }
    if (typeof sourceFillStyleId === "string") {
      sourceColor = colorTokens.get(stripToLoadableId(sourceFillStyleId));
    }
    if (typeof correspondingFillStyleId === "string") {
      correspondingColor = colorTokens.get(
        stripToLoadableId(correspondingFillStyleId),
      );
    }






    console.log(
      "node, sourceCounterpartNode, correspondingAstroNode",
      node,
      sourceCounterpartNode,
      correspondingAstroNode,
    );

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
      case !!usedColor && !!correspondingColor: {
        let pass = false;
        let message = "";
        if (fillStyleId === correspondingFillStyleId) {
          pass = true;
          message =
            "Node is using the same fill style as the source Astro component.";
        } else {
          message =
            "Node is not using the same fill style as the source Astro component.";
        }
        resolve({
          ...testResult,
          id: `${test}-1`,
          pass: pass,
          message: message,
        });
        break;
      }

      default: {
        resolve({
          ...testResult,
          id: `${test}-2`,
          // ignore: true,
          message: "No source Astro component to compare fill style.",
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
