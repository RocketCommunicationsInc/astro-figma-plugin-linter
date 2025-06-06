import { AstroComponent } from "../../types/astro";
import { InstanceOverride } from "../../types/overrides";

const instanceOverrides: Map<
  string,
  {
    overriddenFields: InstanceOverride["overriddenFields"];
    sourceCounterpartNode: ComponentNode | null;
    astroComponentMeta: AstroComponent | undefined;
    sourceAstroComponent: ComponentNode | ComponentSetNode | null;
    nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null;
  }
> = new Map();

const clearInstanceOverrides = () => {
  instanceOverrides.clear();
};

const addInstanceOverride = (
  instanceOverride: InstanceOverride,
  sourceCounterpartNode: ComponentNode | null = null,
  astroComponentMeta: AstroComponent | undefined = undefined,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null = null,
  nearestSourceAstroComponent: ComponentNode | ComponentSetNode | null = null,
) => {
  instanceOverrides.set(instanceOverride.id, {
    overriddenFields: instanceOverride.overriddenFields,
    sourceCounterpartNode,
    astroComponentMeta,
    sourceAstroComponent,
    nearestSourceAstroComponent,
  });
  console.log("instanceOverrides", instanceOverrides);
};

const getInstanceOverride = (id: string) => {
  const instanceOverride = instanceOverrides.get(id);
  return instanceOverride;
};

export { clearInstanceOverrides, addInstanceOverride, getInstanceOverride };
