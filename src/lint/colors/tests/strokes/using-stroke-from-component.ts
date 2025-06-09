import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { tokens, stripToLoadableId } from "../../../../tokens";
import { PaintColorToken } from "../../../../types/tokens";

const usingStrokeFromComponent = (
  node: FillStyleNode,
  directLibraryCounterpartNode: FillStyleNode | null
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Color Stroke from a Component";
    const name = node.name;
    const pass = false;
    const message = "";

    const strokeStyleId = "strokeStyleId" in node ? node.strokeStyleId : undefined;
    const sourceStrokeStyleId =
      directLibraryCounterpartNode && "strokeStyleId" in directLibraryCounterpartNode
        ? directLibraryCounterpartNode.strokeStyleId
        : undefined;
    const { colorTokens } = tokens();
    let usedColor,
      sourceColor: PaintColorToken | undefined = undefined;
    if (typeof strokeStyleId === "string") {
      usedColor = colorTokens.get(stripToLoadableId(strokeStyleId));
    }
    if (typeof sourceStrokeStyleId === "string") {
      sourceColor = colorTokens.get(stripToLoadableId(sourceStrokeStyleId));
    }

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
      sourceColor,
    };

    switch (true) {
      case !!usedColor && !!sourceColor: {
        let pass = false
        let message = "";
        if (strokeStyleId === sourceStrokeStyleId) {
          pass = true;
          message =
            "Node is using the same stroke style as the source Astro component.";
        } else {
          message =
          "Node is not using the same stroke style as the source Astro component.";
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
          ignore: true,
          message: "No source Astro component to compare stroke style.",
        });
        break;
      }
    }

    resolve({
      ...testResult,
      message: `An unexpected error occurred when linting strokes`,
    });
  });
};

export { usingStrokeFromComponent };
