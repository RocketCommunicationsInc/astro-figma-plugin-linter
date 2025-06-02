import { AstroComponent } from "../../types/astro";
import { FillStyleNode } from "../../types/figma";
import { tokens } from "../../tokens";
import { componentLoaderFunction } from "./component-loader";
import { findNearestAstroComponent } from "./find-nearest-astro-component";

const { astroComponents } = tokens();

/**
 * Get the source Astro component for a given node.
 * @param node - The node to check.
 * @returns The source Astro component or null if not found.
 */
const getSourceAstroComponent = async (
  node: FillStyleNode
): Promise<{
  sourceAstroComponent: ComponentNode | ComponentSetNode | null;
  astroComponentMeta: AstroComponent | undefined;
  sourceCounterpartNode: ComponentNode | null;
}> => {
  if (node.type === "INSTANCE") {
    const sourceCounterpartNode: ComponentNode | null = await (node as InstanceNode).getMainComponentAsync();

    const sourceCounterpartNodeKey: string | undefined = sourceCounterpartNode?.key;
    // Check if sourceCounterpartNode is one of the Astro components in components
    let astroComponentMeta: AstroComponent | undefined =
      astroComponents.get(sourceCounterpartNodeKey);

    if (!astroComponentMeta && sourceCounterpartNode?.parent?.type === "COMPONENT_SET") {
      const sourceCounterpartNodeParentKey: string | undefined =
        sourceCounterpartNode?.parent?.key;
      astroComponentMeta = astroComponents.get(sourceCounterpartNodeParentKey);
    }

    let sourceAstroComponent = null;
    if (astroComponentMeta) {
      // Load the Astro component from Figma
      sourceAstroComponent = await componentLoaderFunction(
        astroComponentMeta.type,
        astroComponentMeta.key
      );
    }

    return { sourceAstroComponent, astroComponentMeta, sourceCounterpartNode };
  } else {
    // If the node is not an instance, return null values
    return {
      sourceAstroComponent: null,
      astroComponentMeta: undefined,
      sourceCounterpartNode: null,
    };
  }
};

export { getSourceAstroComponent };
