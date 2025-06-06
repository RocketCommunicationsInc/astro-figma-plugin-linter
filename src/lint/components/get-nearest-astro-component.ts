import { addInstanceOverride, getInstanceOverride } from "../overrides";
import { AstroComponent } from "../../types/astro";
import { componentLoaderFunction } from "./component-loader";
import { findNearestAstroComponent } from "./find-nearest-astro-component";
import { FillStyleNode } from "../../types/figma";
import { tokens } from "../../tokens";

const { astroComponents } = tokens();

const getNearestAstroComponent = async (
  node: FillStyleNode
): Promise<boolean> => {
  console.log("getNearestAstroComponent", node.id, node.name);
  if (node.type === "INSTANCE") {
    return false;
  }

  let nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null = null;

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

    console.log(
      "nearestSourceAstroComponent",
      node.id,
      nearestSourceAstroComponent
    );

    if (nearestSourceAstroComponent) {
      const relatedOverride = getInstanceOverride(node.id);
      const updatedOverride = {
        ...relatedOverride,
        nearestSourceAstroComponent,
      };
      console.log('relatedOverride', relatedOverride, node.id)
      console.log('updatedOverride', updatedOverride)
      // addInstanceOverride(updatedOverride);
    }

    return true;
  }
  return false;
};

export { getNearestAstroComponent };
