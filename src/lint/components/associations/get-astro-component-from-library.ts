import { AstroComponent } from "../../../types/astro";
import { TestableNode } from "../../../types/figma";
import { componentLoaderFunction } from "../component-loader";

interface GetAstroComponentFromLibrary {
  (
    node: TestableNode,
    astroComponentMeta: AstroComponent | undefined
  ): Promise<ComponentNode | ComponentSetNode | null>;
}

const getAstroComponentFromLibrary: GetAstroComponentFromLibrary = async (
  node,
  astroComponentMeta
) => {
  let astroComponentFromLibrary: ComponentNode | ComponentSetNode | null = null;

  if (node.type === "INSTANCE") {
    if (astroComponentMeta) {
      // Load the Astro component from Figma
      astroComponentFromLibrary = await componentLoaderFunction(
        astroComponentMeta.type,
        astroComponentMeta.key
      );
    }
  }
  return astroComponentFromLibrary;
}

export { getAstroComponentFromLibrary };
