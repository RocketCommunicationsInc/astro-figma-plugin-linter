import { addInstanceOverride } from "../collect-data/overrides";
import { FillStyleNode } from "../../types/figma";

const collectOverrides = async (node: FillStyleNode): Promise<boolean> => {
  if (node.type !== "INSTANCE") {
    return false;
  }

  const instanceOverrides = (node as InstanceNode).overrides;
  instanceOverrides.map((instanceOverride) => {
    addInstanceOverride(
      instanceOverride
    );
  });

  return true;
};

export { collectOverrides };
