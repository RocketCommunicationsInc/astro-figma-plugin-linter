import { FillStyleNode } from "../../../types";
import { LintingResult } from "../../types";

const usingColorFromComponent = (
  node: FillStyleNode,
  sourceCounterpartNode: FillStyleNode | undefined
): LintingResult => {
  let pass = false;

  if (sourceCounterpartNode) {
    // Is this node using a paint style in the source Astro component?
    const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
    const sourceFillStyleId =
      "fillStyleId" in sourceCounterpartNode
        ? sourceCounterpartNode.fillStyleId
        : undefined;
    pass = fillStyleId === sourceFillStyleId;
  }
  const message = (pass) ?
    `Node is using the same fill style as the source Astro component: ${sourceCounterpartNode?.name}` :
    `Node is not using the same fill style as the source Astro component: ${sourceCounterpartNode?.name}`;
  return {
    test: "usingColorFromComponent",
    pass,
    message,
    name: node.name,
    node: node,
    sourceCounterpartNode: sourceCounterpartNode,
  };
};

export {usingColorFromComponent}
