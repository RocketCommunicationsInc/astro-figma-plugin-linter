import { addInstanceOverride } from "../collect-data/overrides";
import { AstroComponent } from "../../types/astro";
import { componentLoaderFunction } from "./component-loader";
import { FillStyleNode } from "../../types/figma";
import { tokens } from "../../tokens";
import { addAssociation } from "../collect-data/associations";
import { AssociationSet } from "../../types/associations";
import { getNearestAstroComponent } from "./get-nearest-astro-component";

const { astroComponents } = tokens();

const collectAssociations = async (node: FillStyleNode): Promise<boolean> => {
  // Todo: break these into separate functions
  let astroComponentMeta: AstroComponent | undefined = undefined;
  let sourceCounterpartNode: ComponentNode | null = null;
  let sourceAstroComponent: ComponentNode | ComponentSetNode | null = null;
  let nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null = null;
  if (node.type === "INSTANCE") {
    sourceCounterpartNode = await (
      node as InstanceNode
    ).getMainComponentAsync();

    const sourceCounterpartNodeKey: string | undefined =
      sourceCounterpartNode?.key;
    astroComponentMeta = astroComponents.get(sourceCounterpartNodeKey);

    if (
      !astroComponentMeta &&
      sourceCounterpartNode?.parent?.type === "COMPONENT_SET"
    ) {
      const sourceCounterpartNodeParentKey: string | undefined =
        sourceCounterpartNode?.parent?.key;
      astroComponentMeta = astroComponents.get(sourceCounterpartNodeParentKey);
    }

    if (astroComponentMeta) {
      // Load the Astro component from Figma
      sourceAstroComponent = await componentLoaderFunction(
        astroComponentMeta.type,
        astroComponentMeta.key
      );
    }
  }

  nearestSourceAstroComponent = await getNearestAstroComponent(node);

  const associationSet: AssociationSet = {
    sourceCounterpartNode,
    astroComponentMeta,
    sourceAstroComponent,
    nearestSourceAstroComponent,
  };

  addAssociation(node.id, associationSet);

  return true;
};

export { collectAssociations };
