import { TestableNode } from "../../types/figma";
import { collectAssociations } from "../components/collect-associations";

async function collectAllAssociations(testableNodes: TestableNode[], children: TestableNode[]) {
  const promises: Promise<boolean | void>[] = [];
  for (const node of testableNodes) {
    // debugger;
    promises.push(collectAssociations(node).catch(console.error));
    children.forEach(child =>
      promises.push(collectAssociations(child).catch(console.error))
    );
  }
  await Promise.all(promises);
}

export { collectAllAssociations };
