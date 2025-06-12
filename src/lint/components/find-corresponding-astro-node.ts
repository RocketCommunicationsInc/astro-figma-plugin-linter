import { TestableNode } from "../../types/figma";
import { isFillStyleNode } from "./is-fill-style-node";

type ComponentSourceNode = ComponentNode | ComponentSetNode | null;

// Figma node IDs are in the format "123:456;789:101112",
// where the last segment is unique,
// AND shared across instances of the same component.
// This means we can use the last segment of the ID
// to find the corresponding Astro component.
// We will use a regex to extract the last segment of the ID.
//
// There are exceptions but this is the most reliable way to
// find the corresponding Astro component for a given nested Figma node.
const findCorrespondingNodeById = (
  startingNode: TestableNode,
  nearestLibraryParentAstroComponent: ComponentSourceNode
): TestableNode | null => {
  let correspondingNode: TestableNode | null = null;
  const regexMatchableIdSegments = /(\d+:\d+)(?!.*\d+:\d+)/;
  if (
    nearestLibraryParentAstroComponent &&
    "findOne" in nearestLibraryParentAstroComponent === false
  ) {
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
  correspondingNode =
    foundNode && isFillStyleNode(foundNode) ? foundNode : null;
  return correspondingNode;
};

const findCorrespondingAstroNodeFromLibrary = (
  node: TestableNode,
  directLibraryCounterpartNode: ComponentNode | null = null,
  nearestLibraryParentAstroComponent: ComponentNode | ComponentSetNode | null = null
): TestableNode | null => {

  let correspondingAstroNode: TestableNode | null = null;

  switch (true) {
    // nearestLibraryParentAstroComponent
    case !!findCorrespondingNodeById(
      node,
      nearestLibraryParentAstroComponent
    ): {
      correspondingAstroNode = findCorrespondingNodeById(
        node,
        nearestLibraryParentAstroComponent
      );
      return correspondingAstroNode;
    }

    // directLibraryCounterpartNode
    case !!directLibraryCounterpartNode &&
    isFillStyleNode(directLibraryCounterpartNode): {
      correspondingAstroNode = directLibraryCounterpartNode;
      return correspondingAstroNode;
    }

    default: {
      return null;
    }
  }
};

export { findCorrespondingAstroNodeFromLibrary };
