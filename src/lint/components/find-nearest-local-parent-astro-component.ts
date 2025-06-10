import { isFillStyleNode } from "./is-fill-style-node";
import { tokens } from "../../tokens";
import { TestableNode } from "../../types/figma";
import { AstroComponent } from "../../types/astro";
const { astroComponents } = tokens();

interface FindNearestLocalParentAstroComponentResult {
  nearestLocalParentAstroComponentLocal: InstanceNode | null;
  nearestLocalParentAstroComponentMeta: AstroComponent | undefined | null;
}

const findNearestLocalParentAstroComponent = (node: TestableNode): FindNearestLocalParentAstroComponentResult | null => {
  const returnNull = {
    nearestLocalParentAstroComponentLocal: null,
    nearestLocalParentAstroComponentMeta: null,
  };

  if (node.type === "INSTANCE" && astroComponents.has(node.name)) {
    // If the node is an instance and has a corresponding Astro component, return it
    const nearestLocalParentAstroComponentLocal = node as InstanceNode;
    const nearestLocalParentAstroComponentMeta = astroComponents.get(node.name);

    return {
      nearestLocalParentAstroComponentLocal,
      nearestLocalParentAstroComponentMeta,
    };
  }

  if (node.parent) {
    // If the node has a parent, recursively search in the parent
    // Ensure node.parent is a TestableNode before recursion
    if (isFillStyleNode(node.parent)) {
      return findNearestLocalParentAstroComponent(node.parent);
    } else {
      return returnNull;
    }
  }

  return returnNull;
};

export { findNearestLocalParentAstroComponent };
