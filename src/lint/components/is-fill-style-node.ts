// Type guard to check if a node is a FillStyleNode
function isFillStyleNode(node: BaseNode): node is FillStyleNode {
  // Adjust this check based on the actual structure of FillStyleNode
  return (
    "fills" in node &&
    "type" in node &&
    typeof (node as any).fills !== "undefined"
  );
}

export { isFillStyleNode };
