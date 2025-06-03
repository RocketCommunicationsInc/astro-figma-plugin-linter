import { isFillStyleNode } from "./is-fill-style-node";
import { tokens } from "../../tokens";
import { FillStyleNode } from "../../types/figma";
import { AstroComponent } from "../../types/astro";
const { astroComponents } = tokens();

interface FindNearestAstroComponentResult {
  nearestAstroComponentLocal: InstanceNode | null;
  nearestAstroComponentMeta: AstroComponent | undefined | null;
  nearestSourceHistory: { name: string; id: string }[];
}

const findNearestAstroComponent = (
  node: FillStyleNode,
  history: { name: string; id: string }[] = []
): FindNearestAstroComponentResult | null => {
  const returnNull = {
    nearestAstroComponentLocal: null,
    nearestAstroComponentMeta: null,
    nearestSourceHistory: [],
  };
  if (node.type === "INSTANCE" && astroComponents.has(node.name)) {
    // try {
      // If the node is an instance and has a corresponding Astro component, return it
      const nearestAstroComponentLocal = node as InstanceNode;
      const nearestAstroComponentMeta = astroComponents.get(node.name);
      const nn = node.name;
      history.push({ name: node.name, id: node.id });
      const nearestSourceHistory = history;
      // debugger;
      return {
        nearestAstroComponentLocal,
        nearestAstroComponentMeta,
        nearestSourceHistory,
      };
    // } catch (error) {
    //   console.error("Error finding nearest Astro component:", error);
    //   return {
    //     nearestAstroComponentLocal: null,
    //     nearestAstroComponentMeta: null,
    //     nearestSourceHistory: [],
    //   };
    // }
  }
  if (node.parent) {
    // If the node has a parent, recursively search in the parent
    history.push({ name: node.name, id: node.id });
    // Ensure node.parent is a FillStyleNode before recursion
    if (isFillStyleNode(node.parent)) {
      return findNearestAstroComponent(node.parent, history);
    } else {
      return returnNull;
    }
  }
  return returnNull;
};

export { findNearestAstroComponent };
