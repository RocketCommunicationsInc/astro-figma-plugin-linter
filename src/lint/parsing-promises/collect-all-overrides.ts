import { TestableNode } from "../../types/figma";
import { collectOverrides } from "../components/collect-overrides";

async function collectAllOverrides(testableNodes: TestableNode[], children: TestableNode[]) {
  const promises: Promise<boolean | void>[] = [];
  for (const node of testableNodes) {
    promises.push(collectOverrides(node).catch(console.error));
    children.forEach(child =>
      promises.push(collectOverrides(child).catch(console.error))
    );
  }
  await Promise.all(promises);
}

export { collectAllOverrides };
