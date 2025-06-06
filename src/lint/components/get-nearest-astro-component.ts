import {
  addInstanceOverride,
  getInstanceOverride,
} from "../collect-data/overrides";
import { AstroComponent } from "../../types/astro";
import { componentLoaderFunction } from "./component-loader";
import { findNearestAstroComponent } from "./find-nearest-astro-component";
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


  const nearestAstroComponentResult = findNearestAstroComponent(node);

  if (
    nearestAstroComponentResult &&
    nearestAstroComponentResult.nearestAstroComponentLocal
  ) {
    const { nearestAstroComponentLocal, nearestAstroComponentMeta } =
      nearestAstroComponentResult;
    if (nearestAstroComponentMeta) {
      // Load the Astro component from Figma
      nearestSourceAstroComponent = await componentLoaderFunction(
        nearestAstroComponentMeta.type,
        nearestAstroComponentMeta.key
      );
    }

    if (nearestSourceAstroComponent) {
      return nearestSourceAstroComponent;
    }
  }
  return null;
};

export { getNearestAstroComponent };
