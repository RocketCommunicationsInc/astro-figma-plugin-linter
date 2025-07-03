import { AstroComponent } from "../../types/astro";
import { TestableNode } from "../../types/figma";
import { addAssociation } from "../collect-data/associations";
import { AssociationSet } from "../../types/associations";
import { getNearestLibraryParentAstroComponent } from "./associations/get-nearest-library-parent-astro-component";
import { findCorrespondingAstroNodeFromLibrary } from "./associations/find-corresponding-astro-node";
import { findLibraryParentIcon } from "./associations/find-library-parent-icon";
import { getDirectLibraryCounterpartNode } from "./associations/get-direct-library-counterpart-node";
import { getAstroComponentMeta } from "./associations/get-astro-component-meta";
import { getAstroComponentFromLibrary } from "./associations/get-astro-component-from-library";
import { getAstroIconFromLibrary } from "./associations/get-astro-icon-from-library";

const collectAssociations = async (node: TestableNode): Promise<boolean> => {
  let astroComponentMeta: AstroComponent | undefined = undefined;
  let directLibraryCounterpartNode: ComponentNode | null = null;
  let astroComponentFromLibrary: ComponentNode | ComponentSetNode | null = null;
  let nearestLibraryParentAstroComponent: | ComponentNode | ComponentSetNode | null = null;
  let correspondingAstroNodeFromLibrary: TestableNode | null = null;
  let localAstroIconMeta: AstroComponent | null = null;
  let astroIconFromLibrary: ComponentNode | ComponentSetNode | null = null;

  directLibraryCounterpartNode = await getDirectLibraryCounterpartNode(node);
  astroComponentMeta = await getAstroComponentMeta(node, directLibraryCounterpartNode);
  astroComponentFromLibrary = await getAstroComponentFromLibrary(node, astroComponentMeta);
  nearestLibraryParentAstroComponent = await getNearestLibraryParentAstroComponent(node);
  correspondingAstroNodeFromLibrary = findCorrespondingAstroNodeFromLibrary(node, directLibraryCounterpartNode, nearestLibraryParentAstroComponent);
  localAstroIconMeta = findLibraryParentIcon(node);
  astroIconFromLibrary = await getAstroIconFromLibrary(localAstroIconMeta);

  const associationSet: AssociationSet = {
    directLibraryCounterpartNode,
    astroComponentMeta,
    astroComponentFromLibrary,
    nearestLibraryParentAstroComponent,
    correspondingAstroNodeFromLibrary,
    localAstroIconMeta,
    astroIconFromLibrary,
  };

  addAssociation(node.id, associationSet);

  return true;
};

export { collectAssociations };
