import { isFillStyleNode } from "./is-fill-style-node";
import { tokens } from "../../tokens";
const { astroComponents } = tokens();

const findNearestAstroComponent = (
  node: FillStyleNode,
  history: { name: string; id: string }[] = []
) => {
  console.log('history', history)
  if (node.type === "INSTANCE" && astroComponents.has(node.name)) {
    // If the node is an instance and has a corresponding Astro component, return it
    // try {
    //   const nn = node.getMainComponentAsync();
    //   debugger;
    // } catch (error) {
    //   console.error("Error getting main component:", error);
    // }
    // console.log('node.getMainComponentAsync', node.getMainComponentAsync)
    // const asdf = (node.getMainComponentAsync)
    const nearestAstroComponentLocal = node as InstanceNode;
    const astroComponentMeta = astroComponents.get(node.name);
    history.push({name: node.name, id: node.id});
    debugger;
    return {nearestAstroComponentLocal, astroComponentMeta, history};
  }
  if (node.parent) {
    // If the node has a parent, recursively search in the parent
    history.push({name: node.name, id: node.id});
    // Ensure node.parent is a FillStyleNode before recursion
    if (isFillStyleNode(node.parent)) {
      return findNearestAstroComponent(node.parent, history);
    } else {
      return null;
    }
  }
}

export { findNearestAstroComponent };
