import { InstanceOverride } from "../types/overrides";

// let instanceOverrides: InstanceOverride[] = [];
// const instanceOverrides = new Map<string, InstanceOverride>();
const instanceOverrides = new Map();

const clearInstanceOverrides = () => {
  // instanceOverrides = [];
};

const addInstanceOverride = (instanceOverride: InstanceOverride, sourceCounterpartNode: ComponentNode) => {
  // instanceOverrides.push(instanceOverride);
  instanceOverrides.set(instanceOverride.id, { overriddenFields: instanceOverride.overriddenFields, sourceCounterpartNode });
  console.log('instanceOverrides', instanceOverrides)
};

const getInstanceOverride = (id:string) => {
  const instanceOverride = instanceOverrides.get(id);
  return instanceOverride;
};

export { clearInstanceOverrides, addInstanceOverride, getInstanceOverride };


