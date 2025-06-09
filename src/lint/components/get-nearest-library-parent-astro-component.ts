import {
  addInstanceOverride,
  getInstanceOverride,
} from "../collect-data/overrides";
import { AstroComponent } from "../../types/astro";
import { componentLoaderFunction } from "./component-loader";
import { findNearestLocalParentAstroComponent } from "./find-nearest-local-parent-astro-component";
import { FillStyleNode } from "../../types/figma";
import { tokens } from "../../tokens";

const { astroComponents } = tokens();

const getNearestLibraryParentAstroComponent = async (
  node: FillStyleNode
): Promise<ComponentNode | ComponentSetNode | null> => {
  let nearestLibraryParentAstroComponent: ComponentNode | ComponentSetNode | null =
    null;

  if (node.type === "INSTANCE") {
    const nnn = node;
    const nn = node.name;
    const nt = node.type;
    // todo: same as sourceCounterpartNode in collect-associations.ts??
    nearestLibraryParentAstroComponent = await (
      node as InstanceNode
    ).getMainComponentAsync();
    if (nearestLibraryParentAstroComponent) {
      return nearestLibraryParentAstroComponent;
    }
    return null;
  }


  //todo: need to use this to get the component from the library
  const nearestLocalParentAstroComponentResult = findNearestLocalParentAstroComponent(node);

  if (
    nearestLocalParentAstroComponentResult &&
    nearestLocalParentAstroComponentResult.nearestLocalParentAstroComponentLocal
  ) {
    const { nearestLocalParentAstroComponentLocal, nearestLocalParentAstroComponentMeta } =
      nearestLocalParentAstroComponentResult;
    if (nearestLocalParentAstroComponentMeta) {
      // Load the Astro component from Figma
      nearestLibraryParentAstroComponent = await componentLoaderFunction(
        nearestLocalParentAstroComponentMeta.type,
        nearestLocalParentAstroComponentMeta.key
      );
    }

    if (nearestLibraryParentAstroComponent) {
      return nearestLibraryParentAstroComponent;
    }
  }
  return null;
};

export { getNearestLibraryParentAstroComponent };
