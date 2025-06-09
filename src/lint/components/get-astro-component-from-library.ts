import { addInstanceOverride } from "../collect-data/overrides";
import { AstroComponent } from "../../types/astro";
import { componentLoaderFunction } from "./component-loader";
import { FillStyleNode } from "../../types/figma";
import { findNearestLocalParentAstroComponent } from "./find-nearest-local-parent-astro-component";
import { tokens } from "../../tokens";

const { astroComponents } = tokens();

/**
 * Get the source Astro component for a given node.
 * @param node - The node to check.
 * @returns The source Astro component or null if not found.
 */
const getAstroComponentFromLibrary = async (
  node: FillStyleNode
): Promise<{
  astroComponentMeta: AstroComponent | undefined;
  nearestLibraryParentAstroComponent: ComponentNode | ComponentSetNode | null;
  astroComponentFromLibrary: ComponentNode | ComponentSetNode | null;
  directLibraryCounterpartNode: ComponentNode | null;
}> => {
  // Todo: break these into separate functions
  let astroComponentMeta: AstroComponent | undefined = undefined;
  let instanceOverrides = undefined;
  // let nearestAstroComponent;
  let nearestLocalParentAstroComponentLocal;
  let nearestLocalParentAstroComponentMeta;
  let nearestLibraryParentAstroComponent = null;
  let astroComponentFromLibrary = null;
  let directLibraryCounterpartNode = null;

  const returnObject = {
    astroComponentMeta,
    nearestLibraryParentAstroComponent,
    astroComponentFromLibrary,
    directLibraryCounterpartNode,
  };

  if (!(node.type === "INSTANCE")) {
    // Get the nearest ancestor that has a masterComponent
    ({
      nearestLocalParentAstroComponentLocal,
      nearestLocalParentAstroComponentMeta
    } = findNearestLocalParentAstroComponent(node));
  }
  if (node.type === "INSTANCE") {
    directLibraryCounterpartNode = await (
      node as InstanceNode
    ).getMainComponentAsync();

    instanceOverrides = (node as InstanceNode).overrides;
    instanceOverrides.map((instanceOverride) => {
      addInstanceOverride(instanceOverride, directLibraryCounterpartNode)
    });

    const sourceCounterpartNodeKey: string | undefined =
      directLibraryCounterpartNode?.key;
    // Check if directLibraryCounterpartNode is one of the Astro components in components
    astroComponentMeta = astroComponents.get(
      sourceCounterpartNodeKey
    );

    if (
      !astroComponentMeta &&
      directLibraryCounterpartNode?.parent?.type === "COMPONENT_SET"
    ) {
      const sourceCounterpartNodeParentKey: string | undefined =
        directLibraryCounterpartNode?.parent?.key;
      astroComponentMeta = astroComponents.get(sourceCounterpartNodeParentKey);
    }

    if (astroComponentMeta) {
      // Load the Astro component from Figma
      astroComponentFromLibrary = await componentLoaderFunction(
        astroComponentMeta.type,
        astroComponentMeta.key
      );
    }

    return {
      ...returnObject,
      astroComponentMeta,
      astroComponentFromLibrary,
      directLibraryCounterpartNode,
    };
  } else if (nearestLocalParentAstroComponentLocal) {
    try {
      if (nearestLocalParentAstroComponentMeta) {
        // Load the Astro component from Figma
        nearestLibraryParentAstroComponent = await componentLoaderFunction(
          nearestLocalParentAstroComponentMeta.type,
          nearestLocalParentAstroComponentMeta.key
        );
      }

      return {
        ...returnObject,
        nearestLibraryParentAstroComponent
      };
    } catch (error) {
      console.error("Error getting main component:", error);
      // If there's an error, return null values
      return {
        ...returnObject,
      };
    }
  } else {
    // If the node is not an instance, return null values
    return {
      ...returnObject,
    };
  }
};

export { getAstroComponentFromLibrary };
