import { FillStyleNode } from "../../types/figma";
import { isFillStyleNode } from "./is-fill-style-node";

const findCorrespondingAstroNode = (
  node: FillStyleNode,
  nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null
): FillStyleNode | null => {
  // Figma node IDs are in the format "123:456;789:101112",
  // where the last segment is unique,
  // AND shared across instances of the same component.
  // This means we can use the last segment of the ID
  // to find the corresponding Astro component.
  // We will use a regex to extract the last segment of the ID.
  const nsac = nearestSourceAstroComponent;
  const regexMatchableIdSegments = /(\d+:\d+)(?!.*\d+:\d+)/;
  const targetNodeName = node.name;
  const targetIdSegments = node.id.match(regexMatchableIdSegments);
  const lastSegment = targetIdSegments ? targetIdSegments[1] : undefined;
  const correspondingAstroNode = nearestSourceAstroComponent?.findOne(
    (node) => {
      const searchIdSegments = node.id.match(regexMatchableIdSegments);
      const searchLastSegment = searchIdSegments
        ? searchIdSegments[1]
        : undefined;
      return searchLastSegment === lastSegment && node.name === targetNodeName;
    }
  );

  return correspondingAstroNode && isFillStyleNode(correspondingAstroNode)
    ? correspondingAstroNode
    : null;
};

export { findCorrespondingAstroNode };
