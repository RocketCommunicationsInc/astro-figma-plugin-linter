import { TestableNode } from "../../../types/figma";
import { AstroComponent } from "../../../types/astro";
import { tokens } from "../../../tokens";

interface GetAstroComponentMeta {
  (
    node: TestableNode,
    directLibraryCounterpartNode: ComponentNode | null
  ): Promise<AstroComponent | undefined>;
}

const getAstroComponentMeta: GetAstroComponentMeta = async (
  node,
  directLibraryCounterpartNode
) => {
  let astroComponentMeta: AstroComponent | undefined = undefined;
  const { astroComponents } = tokens();

  if (node.type === "INSTANCE") {
    const sourceCounterpartNodeKey: string | undefined =
      directLibraryCounterpartNode?.key;
    astroComponentMeta = astroComponents.get(sourceCounterpartNodeKey);
  }

  if (
    !astroComponentMeta &&
    directLibraryCounterpartNode?.parent?.type === "COMPONENT_SET"
  ) {
    const sourceCounterpartNodeParentKey: string | undefined =
      directLibraryCounterpartNode?.parent?.key;
    astroComponentMeta = astroComponents.get(sourceCounterpartNodeParentKey);
  }

  return astroComponentMeta;
};
export { getAstroComponentMeta };
