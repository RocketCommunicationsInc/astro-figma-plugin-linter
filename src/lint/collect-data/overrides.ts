import { InstanceOverride } from "../../types/overrides";

const instanceOverrides: Map<string, string[]> = new Map();

const clearInstanceOverrides = () => {
  instanceOverrides.clear();
};

const addInstanceOverride = (
  instanceOverride: InstanceOverride,
) => {
  instanceOverrides.set(
    instanceOverride.id,
    instanceOverride.overriddenFields);
};

const getInstanceOverride = (id: string) => {
  const instanceOverride = instanceOverrides.get(id);
  return instanceOverride;
};

export { clearInstanceOverrides, addInstanceOverride, getInstanceOverride };
