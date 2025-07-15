import { findNearestLocalParentAstroComponent } from "../find-nearest-local-parent-astro-component";
import { TestableNode } from "../../../types/figma";

const getNearestLibraryParentAstroComponent = async (
  node: TestableNode
): Promise<ComponentNode | ComponentSetNode | null> => {
  let nearestLibraryParentAstroComponent:
    | ComponentNode
    | ComponentSetNode
    | null = null;

  if (node.type === "INSTANCE") {
    nearestLibraryParentAstroComponent = await (
      node as InstanceNode
    ).getMainComponentAsync();
    if (nearestLibraryParentAstroComponent) {
      return nearestLibraryParentAstroComponent;
    }
    return null;
  }

  const nearestLocalParentAstroComponentResult =
    findNearestLocalParentAstroComponent(node);
  if (
    nearestLocalParentAstroComponentResult &&
    nearestLocalParentAstroComponentResult.nearestLocalParentAstroComponentLocal
  ) {
    const { nearestLocalParentAstroComponentLocal } =
      nearestLocalParentAstroComponentResult;

    if (nearestLocalParentAstroComponentLocal) {
      nearestLibraryParentAstroComponent =
        await nearestLocalParentAstroComponentLocal.getMainComponentAsync();
    }

    if (nearestLibraryParentAstroComponent) {
      return nearestLibraryParentAstroComponent;
    }
  }
  return null;
};

export { getNearestLibraryParentAstroComponent };
