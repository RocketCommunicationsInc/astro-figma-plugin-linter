import { addInstanceOverride } from "../collect-data/overrides";
import { AstroComponent } from "../../types/astro";
import { componentLoaderFunction } from "./component-loader";
import { FillStyleNode } from "../../types/figma";
import { tokens } from "../../tokens";

const { astroComponents } = tokens();

const collectOverrides = async (node: FillStyleNode): Promise<boolean> => {
  if (node.type !== "INSTANCE") {
    return false;
  }

  // Todo: break these into separate functions
  let astroComponentMeta: AstroComponent | undefined = undefined;
  let instanceOverrides = undefined;
  let astroComponentFromLibrary: ComponentNode | ComponentSetNode | null = null;

  const sourceCounterpartNode: ComponentNode | null = await (
    node as InstanceNode
  ).getMainComponentAsync();

  const sourceCounterpartNodeKey: string | undefined =
    sourceCounterpartNode?.key;
  // Check if sourceCounterpartNode is one of the Astro components in components
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
    astroComponentFromLibrary = await componentLoaderFunction(
      astroComponentMeta.type,
      astroComponentMeta.key
    );
  }

  instanceOverrides = (node as InstanceNode).overrides;
  instanceOverrides.map((instanceOverride) => {
    addInstanceOverride(
      instanceOverride,
      sourceCounterpartNode,
      astroComponentMeta,
      astroComponentFromLibrary
    );
  });

  return true;
};

export { collectOverrides };
