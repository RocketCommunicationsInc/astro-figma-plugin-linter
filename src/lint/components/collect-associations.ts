import { addInstanceOverride } from "../collect-data/overrides";
import { AstroComponent } from "../../types/astro";
import { componentLoaderFunction } from "./component-loader";
import { FillStyleNode } from "../../types/figma";
import { tokens } from "../../tokens";
import { addAssociation } from "../collect-data/associations";
import { AssociationSet } from "../../types/associations";
import { getNearestLibraryParentAstroComponent } from "./get-nearest-library-parent-astro-component";
import { findCorrespondingAstroNodeFromLibrary } from "./find-corresponding-astro-node";

const { astroComponents } = tokens();

const collectAssociations = async (node: FillStyleNode): Promise<boolean> => {
  // Todo: break these into separate functions
  let astroComponentMeta: AstroComponent | undefined = undefined;
  let directLibraryCounterpartNode: ComponentNode | null = null;
  let astroComponentFromLibrary: ComponentNode | ComponentSetNode | null = null;
  let nearestLibraryParentAstroComponent: ComponentNode | ComponentSetNode | null = null;
  let correspondingAstroNodeFromLibrary: FillStyleNode | null = null;
  if (node.type === "INSTANCE") {
    directLibraryCounterpartNode = await (
      node as InstanceNode
    ).getMainComponentAsync();

    const sourceCounterpartNodeKey: string | undefined =
      directLibraryCounterpartNode?.key;
    astroComponentMeta = astroComponents.get(sourceCounterpartNodeKey);

    if (
      !astroComponentMeta &&
      directLibraryCounterpartNode?.parent?.type === "COMPONENT_SET"
    ) {
      const sourceCounterpartNodeParentKey: string | undefined =
        directLibraryCounterpartNode?.parent?.key;
      astroComponentMeta = astroComponents.get(sourceCounterpartNodeParentKey);
    }

    if (astroComponentMeta) {
      // Load the Astro component from Figma
      astroComponentFromLibrary = await componentLoaderFunction(
        astroComponentMeta.type,
        astroComponentMeta.key
      );
    }
  }

  nearestLibraryParentAstroComponent = await getNearestLibraryParentAstroComponent(node);

  // Collect this node's corresponding node from an Astro component from the library
  correspondingAstroNodeFromLibrary = findCorrespondingAstroNodeFromLibrary(
    node,
    directLibraryCounterpartNode,
    nearestLibraryParentAstroComponent
  );

  const associationSet: AssociationSet = {
    directLibraryCounterpartNode,
    astroComponentMeta,
    astroComponentFromLibrary,
    nearestLibraryParentAstroComponent,
    correspondingAstroNodeFromLibrary,
  };

  addAssociation(node.id, associationSet);

  return true;
};

export { collectAssociations };
