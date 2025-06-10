import { TestableNode } from "../../../types/figma";
import { tokens, stripToLoadableId } from "../../../tokens";

const getColorFill = (node: TestableNode) => {
  let color = undefined;
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

export { getColorFill };
