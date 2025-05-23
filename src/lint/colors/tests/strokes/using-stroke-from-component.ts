import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";

const usingStrokeFromComponent = (
  node: FillStyleNode,
  sourceCounterpartNode: FillStyleNode | undefined
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Color Stroke from a Component";
    const name = node.name;
    let pass = false;
    let message = "";

    const testResult: LintingResult = {
      test,
      id: `${test}-0`,
      pass,
      message,
      name,
      node,
      sourceCounterpartNode,
    };

    if (sourceCounterpartNode) {
      // Is this node using a paint style in the source Astro component?
      const strokeStyleId = "strokeStyleId" in node ? node.strokeStyleId : undefined;
      const sourceStrokeStyleId =
        "strokeStyleId" in sourceCounterpartNode
          ? sourceCounterpartNode.strokeStyleId
          : undefined;
      pass = strokeStyleId === sourceStrokeStyleId;
    }
    message = pass
      ? `Node is using the same stroke style as the source Astro component: ${sourceCounterpartNode?.name}`
      : `Node is not using the same stroke style as the source Astro component: ${sourceCounterpartNode?.name}`;
    resolve({
      ...testResult,
      id: `${test}-1`,
      pass,
      message,
    });
  });
};

export { usingStrokeFromComponent };
