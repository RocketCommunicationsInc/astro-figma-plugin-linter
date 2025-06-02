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
  nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null;
  nearestSourceHistory: { name: string; id: string }[];
  astroComponentMeta: AstroComponent | undefined;
  sourceCounterpartNode: ComponentNode | null;
}> => {
  // if (node.name === "Check Mark" && node.type === "BOOLEAN_OPERATION") {
  //   const n = node as BooleanOperationNode;
  //   debugger;
  // }
  let nearestAstroComponentLocal;
  let nearestAstroComponent;
  let nearestAstroComponentMeta;
  let nearestSourceAstroComponent = null;
  let nearestSourceHistory;
  if (!(node.type === "INSTANCE")) {
    // Get the nearest ancestor that has a masterComponent
    ({
      nearestAstroComponentLocal,
      nearestAstroComponentMeta,
      nearestSourceHistory,
    } = findNearestAstroComponent(node));
    console.log(
      "nearestAstroComponentLocal, history",
      nearestAstroComponentLocal,
      nearestSourceHistory
    );
    const n = node as BooleanOperationNode;
    debugger;
  }
  if (node.type === "INSTANCE") {
    const sourceCounterpartNode: ComponentNode | null = await (
      node as InstanceNode
    ).getMainComponentAsync();

    const sourceCounterpartNodeKey: string | undefined =
      sourceCounterpartNode?.key;
    // Check if sourceCounterpartNode is one of the Astro components in components
    let astroComponentMeta: AstroComponent | undefined = astroComponents.get(
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

    let sourceAstroComponent = null;
    if (astroComponentMeta) {
      // Load the Astro component from Figma
      sourceAstroComponent = await componentLoaderFunction(
        astroComponentMeta.type,
        astroComponentMeta.key
      );
    }
    debugger;
    return {
      sourceAstroComponent,
      nearestSourceAstroComponent: null,
      nearestSourceHistory: [],
      astroComponentMeta,
      sourceCounterpartNode,
    };
  } else if (nearestAstroComponentLocal) {
    try {
      const sourceCounterpartNode: ComponentNode | null = await (
        nearestAstroComponentLocal as InstanceNode
      ).getMainComponentAsync();

      let nearestSourceAstroComponent;
      if (nearestAstroComponentMeta) {
        // Load the Astro component from Figma
        nearestSourceAstroComponent = await componentLoaderFunction(
          nearestAstroComponentMeta.type,
          nearestAstroComponentMeta.key
        );
      }

      // const nearestAstroComponent = await (node).getMainComponentAsync();
      // const n = node;
      debugger;
      return {
        sourceAstroComponent: null,
        nearestSourceAstroComponent,
        nearestSourceHistory,
        astroComponentMeta: undefined,
        sourceCounterpartNode: null,
      };
    } catch (error) {
      console.error("Error getting main component:", error);
      // If there's an error, return null values
      debugger;
      return {
        sourceAstroComponent: null,
        nearestSourceAstroComponent: null,
        nearestSourceHistory: [],
        astroComponentMeta: undefined,
        sourceCounterpartNode: null,
      };
    }
  } else {
    // If the node is not an instance, return null values
    const n = node;
    debugger;
    return {
      sourceAstroComponent: null,
      nearestSourceAstroComponent: null,
      nearestSourceHistory: [],
      astroComponentMeta: undefined,
      sourceCounterpartNode: null,
    };
  }
};

export { getSourceAstroComponent };
