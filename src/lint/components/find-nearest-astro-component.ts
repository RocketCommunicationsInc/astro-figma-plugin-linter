import { isFillStyleNode } from "./is-fill-style-node";
import { tokens } from "../../tokens";
import { FillStyleNode } from "../../types/figma";
import { AstroComponent } from "../../types/astro";
const { astroComponents } = tokens();

interface FindNearestAstroComponentResult {
  nearestAstroComponentLocal: InstanceNode | null;
  nearestAstroComponentMeta: AstroComponent | undefined | null;
}

const findNearestAstroComponent = (node: FillStyleNode): FindNearestAstroComponentResult | null => {
  const returnNull = {
    nearestAstroComponentLocal: null,
    nearestAstroComponentMeta: null,
  };
  if (node.type === "INSTANCE" && astroComponents.has(node.name)) {
    // If the node is an instance and has a corresponding Astro component, return it
    const nearestAstroComponentLocal = node as InstanceNode;
    const nearestAstroComponentMeta = astroComponents.get(node.name);

    return {
      nearestAstroComponentLocal,
      nearestAstroComponentMeta,
    };
  }
  if (node.parent) {
    // If the node has a parent, recursively search in the parent
    // Ensure node.parent is a FillStyleNode before recursion
    if (isFillStyleNode(node.parent)) {
      return findNearestAstroComponent(node.parent);
    } else {
      return returnNull;
    }
  }
  return returnNull;
};

export { findNearestAstroComponent };
