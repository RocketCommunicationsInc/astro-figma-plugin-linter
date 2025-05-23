import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";

const usingColorFromComponent = (
  node: FillStyleNode,
  sourceCounterpartNode: FillStyleNode | undefined
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Color Fill from a Component";
    const name = node.name;
    let pass = false;
    let message = "";

    const testResult: LintingResult = {
      test,
      pass,
      message,
      name,
      node,
      sourceCounterpartNode,
    };

    if (sourceCounterpartNode) {
      // Is this node using a paint style in the source Astro component?
      const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
      const sourceFillStyleId =
        "fillStyleId" in sourceCounterpartNode
          ? sourceCounterpartNode.fillStyleId
          : undefined;
      pass = fillStyleId === sourceFillStyleId;
    }
    message = pass
      ? `Node is using the same fill style as the source Astro component: ${sourceCounterpartNode?.name}`
      : `Node is not using the same fill style as the source Astro component: ${sourceCounterpartNode?.name}`;
    resolve({
      ...testResult,
      pass,
      message,
    });
  });
};

export { usingColorFromComponent };
