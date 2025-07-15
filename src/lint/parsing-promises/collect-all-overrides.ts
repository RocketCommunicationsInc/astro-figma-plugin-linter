import { TestableNode } from "../../types/figma";
import { collectOverrides } from "../components/collect-overrides";

interface CollectAllOverrides {
  (allNodesToLint: TestableNode[]): Promise<void>;
}

const collectAllOverrides: CollectAllOverrides = async (
  allNodesToLint
) => {
  const promises: Promise<boolean | void>[] = [];
  allNodesToLint.forEach((child) =>
    promises.push(collectOverrides(child).catch(console.error))
  );
  await Promise.all(promises);
};

export { collectAllOverrides };
