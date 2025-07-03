import { TestableNode } from "../../../types/figma";

interface GetDirectLibraryCounterpartNode {
  (node: TestableNode): Promise<ComponentNode | null>;
}

const getDirectLibraryCounterpartNode: GetDirectLibraryCounterpartNode = async (node) => {
  let directLibraryCounterpartNode: ComponentNode | null = null;

  if (node.type === "INSTANCE") {
    directLibraryCounterpartNode = await(
      node as InstanceNode
    ).getMainComponentAsync();
  }

  return directLibraryCounterpartNode;
};

export { getDirectLibraryCounterpartNode };
