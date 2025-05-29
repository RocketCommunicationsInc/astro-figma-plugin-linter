import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { tokens, stripToLoadableId } from "../../../../tokens";
import { PaintColorToken } from "../../../../types/tokens";

const usingFillFromComponent = (
  node: FillStyleNode,
  sourceCounterpartNode: FillStyleNode | null
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Color Fill from a Component";
    const name = node.name;
    const pass = false;
    const message = "";

    const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
    const sourceFillStyleId =
      sourceCounterpartNode && "fillStyleId" in sourceCounterpartNode
        ? sourceCounterpartNode.fillStyleId
        : undefined;
    const { colorTokens } = tokens();
    let usedColorToken,
      sourceColorToken: PaintColorToken | undefined = undefined;
    if (typeof fillStyleId === "string") {
      usedColorToken = colorTokens.get(stripToLoadableId(fillStyleId));
    }
    if (typeof sourceFillStyleId === "string") {
      sourceColorToken = colorTokens.get(stripToLoadableId(sourceFillStyleId));
    }

    const testResult: LintingResult = {
      test,
      id: `${test}-0`,
      pass,
      message,
      name,
      node,
      sourceCounterpartNode,
      usedColorToken,
      sourceColorToken,
    };

    switch (true) {
      case !!usedColorToken && !!sourceColorToken: {
        let pass = false
        let message = "";
        if (fillStyleId === sourceFillStyleId) {
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
