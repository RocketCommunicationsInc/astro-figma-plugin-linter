import { TestableNode } from "../../types/figma";
import { collectContrastScreenshots } from "../components/collect-contrast-screenshots";

interface CollectAllContrastScreenshots {
  (allNodesToLint: TestableNode[]): Promise<void>;
}

const collectAllContrastScreenshots: CollectAllContrastScreenshots = async (
  allNodesToLint
) => {
  const promises: Promise<boolean | void>[] = [];
  allNodesToLint.forEach((child) =>
    promises.push(collectContrastScreenshots(child).catch(console.error))
  );
  await Promise.all(promises);
};

export { collectAllContrastScreenshots };
