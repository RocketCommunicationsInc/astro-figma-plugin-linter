import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";

const usingFillFromComponent = (
  node: FillStyleNode,
  sourceCounterpartNode: FillStyleNode | null
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Color Fill from a Component";
    const name = node.name;
    const pass = false;
    const message = "";

    const testResult: LintingResult = {
      test,
      id: `${test}-0`,
      pass,
      message,
      name,
      node,
      sourceCounterpartNode,
    };

    switch (true) {
      case !!sourceCounterpartNode: {
        const fillStyleId =
          "fillStyleId" in node ? node.fillStyleId : undefined;
        const sourceFillStyleId =
          "fillStyleId" in sourceCounterpartNode
            ? sourceCounterpartNode.fillStyleId
            : undefined;
        const pass = fillStyleId === sourceFillStyleId;
        const message = pass
          ? `Node is using the same fill style as the source Astro component: ${sourceCounterpartNode?.name}`
          : `Node is not using the same fill style as the source Astro component: ${sourceCounterpartNode?.name}`;
        resolve({
          ...testResult,
          id: `${test}-1`,
          pass,
          message,
        });
        break;
      }
      default: {
        resolve({
          ...testResult,
          id: `${test}-2`,
          ignore: true,
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
