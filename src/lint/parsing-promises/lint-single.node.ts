import { TestableNode } from "../../types/figma";
import { AstroTheme } from "../../types/tokens";
import { testColors } from "../colors";
import { testTypography } from "../typography";

const lintSingleNode = async (
  node: TestableNode,
  theme: AstroTheme
): Promise<void> => {
  return new Promise((resolve) => {
    (async () => {
      // Test paint style
      await testColors(node, theme);
      // Test typography
      if (node.type === "TEXT") {
        await testTypography(node);
      }
      resolve();
    })();
  });
};

export { lintSingleNode };
