import { isFillStyleNode } from "../is-fill-style-node";
import { tokens } from "../../../tokens";
import { TestableNode } from "../../../types/figma";
import { AstroComponent } from "../../../types/astro";
const { astroIcons } = tokens();

interface FindLibraryParentIcon {
  (node: TestableNode): AstroComponent | null;
}

// If the node is in an Icon component, we find that component
const findLibraryParentIcon: FindLibraryParentIcon = (
  node
) => {
  if (node.type === "INSTANCE" && astroIcons.has(node.name)) {
    // If the node is an instance and has a corresponding Astro component, return it
    const localAstroIconMeta = astroIcons.get(node.name);

    return localAstroIconMeta;
  }

  if (node.parent) {
    // If the node has a parent, recursively search in the parent
    // Ensure node.parent is a TestableNode before recursion
    if (isFillStyleNode(node.parent)) {
      return findLibraryParentIcon(node.parent);
    } else {
      return null;
    }
  }

  return null;
};

export { findLibraryParentIcon  };
