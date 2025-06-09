import { FillStyleNode } from "../../types/figma";
import { getAssociation } from "../collect-data/associations";
import { findNearestLocalParentAstroComponent } from "./find-nearest-local-parent-astro-component";
import { isFillStyleNode } from "./is-fill-style-node";

type ComponentSourceNode = ComponentNode | ComponentSetNode | null;

// Figma node IDs are in the format "123:456;789:101112",
// where the last segment is unique,
// AND shared across instances of the same component.
// This means we can use the last segment of the ID
// to find the corresponding Astro component.
// We will use a regex to extract the last segment of the ID.
const findCorrespondingNodeById = (
  startingNode: FillStyleNode,
  nearestLibraryParentAstroComponent: ComponentSourceNode
): FillStyleNode | null => {
  let correspondingNode: FillStyleNode | null = null;
  const regexMatchableIdSegments = /(\d+:\d+)(?!.*\d+:\d+)/;
  if (nearestLibraryParentAstroComponent && "findOne" in nearestLibraryParentAstroComponent === false) {
    return null;
  }

  const targetNodeName = startingNode?.name;
  const targetIdSegments = startingNode?.id.match(regexMatchableIdSegments);
  const lastSegment = targetIdSegments ? targetIdSegments[1] : undefined;

  const foundNode = nearestLibraryParentAstroComponent?.findOne((node) => {
    const searchIdSegments = node.id.match(regexMatchableIdSegments);
    const searchLastSegment = searchIdSegments
      ? searchIdSegments[1]
      : undefined;
    return searchLastSegment === lastSegment && node.name === targetNodeName;
  });
  correspondingNode = (foundNode && isFillStyleNode(foundNode)) ? foundNode : null;
  return correspondingNode;
};

const findCorrespondingAstroNode = (
  node: FillStyleNode
): FillStyleNode | null => {

  const {
      directLibraryCounterpartNode,
      astroComponentMeta,
      astroComponentFromLibrary,
      nearestLibraryParentAstroComponent,
    } = getAssociation(node.id);



  let correspondingAstroNode: FillStyleNode | null = null;

  switch (true) {
    // nearestLibraryParentAstroComponent
    case !!findCorrespondingNodeById(node, nearestLibraryParentAstroComponent): {
      correspondingAstroNode = findCorrespondingNodeById(node, nearestLibraryParentAstroComponent);
      break;
    }

    // directLibraryCounterpartNode
    case !!directLibraryCounterpartNode && isFillStyleNode(directLibraryCounterpartNode): {
      correspondingAstroNode = directLibraryCounterpartNode;
      break;
    }

    default: {
      try {
        const nsac = nearestLibraryParentAstroComponent
        const {
          nearestLocalParentAstroComponentLocal,
          nearestLocalParentAstroComponentMeta,
        } = findNearestLocalParentAstroComponent(node);
        // correspondingAstroNode = findCorrespondingNodeById(node, nearestAstroComponentLocal);
        // TODO: this is giving the wrong node. It's local and not the remote one.
        debugger;
      } catch (error) {
        console.error(
          "Error in findCorrespondingAstroNode:",
          error,
          "node.id:",
          node.id,
          "node.name:",
          node.name,
          "astroComponentFromLibrary:",
          astroComponentFromLibrary,
          "nearestLibraryParentAstroComponent:",
          nearestLibraryParentAstroComponent
        );
      }
    }
  }

  return correspondingAstroNode;
};

export { findCorrespondingAstroNode };
