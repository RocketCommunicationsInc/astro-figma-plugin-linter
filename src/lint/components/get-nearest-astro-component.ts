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

const getNearestAstroComponent = async (
  node: FillStyleNode
): Promise<ComponentNode | ComponentSetNode | null> => {
  let nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null =
    null;

  if (node.type === "INSTANCE") {
    const nnn = node;
    const nn = node.name;
    const nt = node.type;
    nearestSourceAstroComponent = await (
      node as InstanceNode
    ).getMainComponentAsync();
    if (nearestSourceAstroComponent) {
      return nearestSourceAstroComponent;
    }
    return null;
  }


  const nearestAstroComponentResult = findNearestLocalParentAstroComponent(node);

  if (
    nearestAstroComponentResult &&
    nearestAstroComponentResult.nearestLocalParentAstroComponentLocal
  ) {
    const { nearestLocalParentAstroComponentLocal, nearestLocalParentAstroComponentMeta } =
      nearestAstroComponentResult;
    if (nearestLocalParentAstroComponentMeta) {
      // Load the Astro component from Figma
      nearestSourceAstroComponent = await componentLoaderFunction(
        nearestLocalParentAstroComponentMeta.type,
        nearestLocalParentAstroComponentMeta.key
      );
    }

    if (nearestSourceAstroComponent) {
      return nearestSourceAstroComponent;
    }
  }
  return null;
};

export { getNearestAstroComponent };
