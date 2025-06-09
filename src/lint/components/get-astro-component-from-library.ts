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
  sourceCounterpartNode: ComponentNode | null;
}> => {
  // Todo: break these into separate functions
  let astroComponentMeta: AstroComponent | undefined = undefined;
  let instanceOverrides = undefined;
  // let nearestAstroComponent;
  let nearestLocalParentAstroComponentLocal;
  let nearestLocalParentAstroComponentMeta;
  let nearestLibraryParentAstroComponent = null;
  let astroComponentFromLibrary = null;
  let sourceCounterpartNode = null;

  const returnObject = {
    astroComponentMeta,
    nearestLibraryParentAstroComponent,
    astroComponentFromLibrary,
    sourceCounterpartNode,
  };

  if (!(node.type === "INSTANCE")) {
    // Get the nearest ancestor that has a masterComponent
    ({
      nearestLocalParentAstroComponentLocal,
      nearestLocalParentAstroComponentMeta
    } = findNearestLocalParentAstroComponent(node));
  }
  if (node.type === "INSTANCE") {
    sourceCounterpartNode = await (
      node as InstanceNode
    ).getMainComponentAsync();

    instanceOverrides = (node as InstanceNode).overrides;
    instanceOverrides.map((instanceOverride) => {
      addInstanceOverride(instanceOverride, sourceCounterpartNode)
    });

    const sourceCounterpartNodeKey: string | undefined =
      sourceCounterpartNode?.key;
    // Check if sourceCounterpartNode is one of the Astro components in components
    astroComponentMeta = astroComponents.get(
      sourceCounterpartNodeKey
    );

    if (
      !astroComponentMeta &&
      sourceCounterpartNode?.parent?.type === "COMPONENT_SET"
    ) {
      const sourceCounterpartNodeParentKey: string | undefined =
        sourceCounterpartNode?.parent?.key;
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
      sourceCounterpartNode,
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
