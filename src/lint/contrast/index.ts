import { addResult } from "../collect-data/results";
import { AstroTheme } from "../../types/tokens";
import { TestableNode } from "../../types/figma";
import { LintingResult } from "../../types/results";
import { hasSufficientContrast } from "./tests/has-sufficient-contrast";

const testContast = async (
  node: TestableNode,
  theme: AstroTheme
): Promise<void> => {
  const contrastTestPromises: Promise<LintingResult>[] = [];

  contrastTestPromises.push(hasSufficientContrast(node));


  await Promise.all(contrastTestPromises)
    .then((results) => {
      results.forEach((result: LintingResult | undefined) => {
        if (result) {
          addResult(result);
        }
      });
      return Promise.resolve();
    })
    .catch((error) => {
      console.error("Error in testContast:", error);
    });
};

export { testContast };
