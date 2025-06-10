import { addInstanceOverride } from "../collect-data/overrides";
import { TestableNode } from "../../types/figma";

const collectOverrides = async (node: TestableNode): Promise<boolean> => {
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
