import { AstroComponent } from "./types";
import { tokens } from "../../tokens";

const { astroComponents } = tokens();

/**
 * Function to load a component or component set by its key.
 * @param componentType - The type of the component (COMPONENT or COMPONENT_SET).
 * @param key - The key of the component or component set.
 * @returns The loaded component or component set.
 */
const componentLoaderFunction: (
  componentType: string,
  key: string
) => Promise<ComponentNode | ComponentSetNode | null> = (
  componentType: string,
  key: string
) => {
  switch (componentType) {
    case "COMPONENT":
      return figma.importComponentByKeyAsync(key);
    case "COMPONENT_SET":
      return figma.importComponentSetByKeyAsync(key);
    default:
      console.error("Unknown component type");
      return Promise.resolve(null);
  }
};

/**
 * Get the source Astro component for a given node.
 * @param node - The node to check.
 * @returns The source Astro component or null if not found.
 */
const getSourceAstroComponent = async (node: InstanceNode) => {
  const mainComponent = await node.getMainComponentAsync();

  const mainComponentKey: string | undefined = mainComponent?.key;
  // Check if mainComponent is one of the Astro components in components
  let isAstroComponent: AstroComponent | undefined =
    astroComponents.get(mainComponentKey);

  if (!isAstroComponent && mainComponent?.parent?.type === "COMPONENT_SET") {
    const mainComponentParentKey: string | undefined =
      mainComponent?.parent?.key;
    isAstroComponent = astroComponents.get(mainComponentParentKey);
  }

  let astroComponent;
  if (isAstroComponent) {
    // Load the Astro component from Figma
    astroComponent = await componentLoaderFunction(
      isAstroComponent.type,
      isAstroComponent.key
    );
  }

  return { astroComponent, isAstroComponent, mainComponent };
};

export { getSourceAstroComponent };
