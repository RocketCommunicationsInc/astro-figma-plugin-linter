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

export { componentLoaderFunction };
