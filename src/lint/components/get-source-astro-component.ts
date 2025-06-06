import { addInstanceOverride } from "../collect-data/overrides";
import { AstroComponent } from "../../types/astro";
import { componentLoaderFunction } from "./component-loader";
import { FillStyleNode } from "../../types/figma";
import { findNearestAstroComponent } from "./find-nearest-astro-component";
import { tokens } from "../../tokens";

const { astroComponents } = tokens();

/**
 * Get the source Astro component for a given node.
 * @param node - The node to check.
 * @returns The source Astro component or null if not found.
 */
const getSourceAstroComponent = async (
  node: FillStyleNode
): Promise<{
  astroComponentMeta: AstroComponent | undefined;
  nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null;
  sourceAstroComponent: ComponentNode | ComponentSetNode | null;
  sourceCounterpartNode: ComponentNode | null;
}> => {
  // Todo: break these into separate functions
  let astroComponentMeta: AstroComponent | undefined = undefined;
  let instanceOverrides = undefined;
  // let nearestAstroComponent;
  let nearestAstroComponentLocal;
  let nearestAstroComponentMeta;
  let nearestSourceAstroComponent = null;
  let sourceAstroComponent = null;
  let sourceCounterpartNode = null;

  const returnObject = {
    astroComponentMeta,
    nearestSourceAstroComponent,
    sourceAstroComponent,
    sourceCounterpartNode,
  };

  if (!(node.type === "INSTANCE")) {
    // Get the nearest ancestor that has a masterComponent
    ({
      nearestAstroComponentLocal,
      nearestAstroComponentMeta
    } = findNearestAstroComponent(node));
  }
  if (node.type === "INSTANCE") {
    sourceCounterpartNode = await (
      node as InstanceNode
    ).getMainComponentAsync();

    instanceOverrides = (node as InstanceNode).overrides;
    // debugger;
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
      sourceAstroComponent = await componentLoaderFunction(
        astroComponentMeta.type,
        astroComponentMeta.key
      );
    }

    return {
      ...returnObject,
      astroComponentMeta,
      sourceAstroComponent,
      sourceCounterpartNode,
    };
  } else if (nearestAstroComponentLocal) {
    try {
      if (nearestAstroComponentMeta) {
        // Load the Astro component from Figma
        nearestSourceAstroComponent = await componentLoaderFunction(
          nearestAstroComponentMeta.type,
          nearestAstroComponentMeta.key
        );
      }

      return {
        ...returnObject,
        nearestSourceAstroComponent
      };
    } catch (error) {
      console.error("Error getting main component:", error);
      // If there's an error, return null values
      // debugger;
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

export { getSourceAstroComponent };
