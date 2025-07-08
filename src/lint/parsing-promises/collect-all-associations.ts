import { TestableNode } from "../../types/figma";
import { collectAssociations } from "../components/collect-associations";

interface CollectAllAssociations {
  (allNodesToLint: TestableNode[]): Promise<void>;
}

const collectAllAssociations: CollectAllAssociations = async (
  allNodesToLint
) => {
  const promises: Promise<boolean | void>[] = [];
  allNodesToLint.forEach((child) =>
    promises.push(collectAssociations(child).catch(console.error))
  );
  await Promise.all(promises);
}

export { collectAllAssociations };
