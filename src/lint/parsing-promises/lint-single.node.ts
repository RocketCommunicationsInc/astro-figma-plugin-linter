import { TestableNode } from "../../types/figma";
import { AstroTheme } from "../../types/tokens";
import { testColors } from "../colors";
import { testContrast } from "../contrast";
import { testTypography } from "../typography";

const lintSingleNode = async (
  node: TestableNode,
  theme: AstroTheme
): Promise<void> => {

  await testColors(node, theme);
  if (node.type === "TEXT") {
    await testTypography(node);
    await testContrast(node);
  }
  
};

export { lintSingleNode };
