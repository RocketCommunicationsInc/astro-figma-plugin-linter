import { FillStyleNode } from "../../types/figma";
import { getAssociation } from "../collect-data/associations";
import { findNearestAstroComponent } from "./find-nearest-astro-component";
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
  nearestSourceAstroComponent: ComponentSourceNode
): FillStyleNode | null => {
  let correspondingNode: FillStyleNode | null = null;
  const regexMatchableIdSegments = /(\d+:\d+)(?!.*\d+:\d+)/;
  if (nearestSourceAstroComponent && "findOne" in nearestSourceAstroComponent === false) {
    return null;
  }

  const targetNodeName = startingNode?.name;
  const targetIdSegments = startingNode?.id.match(regexMatchableIdSegments);
  const lastSegment = targetIdSegments ? targetIdSegments[1] : undefined;

  const foundNode = nearestSourceAstroComponent?.findOne((node) => {
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
      sourceCounterpartNode,
      astroComponentMeta,
      astroComponentFromLibrary,
      nearestSourceAstroComponent,
    } = getAssociation(node.id);



  let correspondingAstroNode: FillStyleNode | null = null;

  switch (true) {
    // nearestSourceAstroComponent
    case !!findCorrespondingNodeById(node, nearestSourceAstroComponent): {
      correspondingAstroNode = findCorrespondingNodeById(node, nearestSourceAstroComponent);
      break;
    }

    // sourceCounterpartNode

    default: {
      try {
        correspondingAstroNode = sourceCounterpartNode;
        // debugger;
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
          "nearestSourceAstroComponent:",
          nearestSourceAstroComponent
        );
      }
    }
  }

  return correspondingAstroNode && isFillStyleNode(correspondingAstroNode)
    ? correspondingAstroNode
    : null;
};

export { findCorrespondingAstroNode };
