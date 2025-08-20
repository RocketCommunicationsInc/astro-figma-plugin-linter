import { addResult } from "../collect-data/results";
import { LintingResult } from "../../types/results";
import { hasSufficientContrast } from "./tests/has-sufficient-contrast";

const testContrast = async (
  node: TextNode
): Promise<void> => {
  const contrastTestPromises: Promise<LintingResult>[] = [];

  contrastTestPromises.push(hasSufficientContrast(node, 'WCAG'));
  contrastTestPromises.push(hasSufficientContrast(node, 'APCA'));

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
      console.error("Error in testContrast:", error);
    });
};

export { testContrast };
