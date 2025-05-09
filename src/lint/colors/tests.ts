import { FillStyleNode } from "../../types";

const isUsingPaintStyle = (node: FillStyleNode) => {
  // Check if the node is using a paint style
  const usingPaintStyle =
    "fillStyleId" in node &&
    typeof node.fillStyleId === "string" &&
    node.fillStyleId
      ? true
      : false;
  return usingPaintStyle;
};

export { isUsingPaintStyle };
