import { FillStyleNode } from "../../../types/figma";
import { LintingResult } from "../../../types/results";
import { stripToLoadableId } from "../../../tokens";
import { tokens } from "../../../tokens";
const { colorTokens } = tokens();

const usingAstroColor = (node: FillStyleNode): Promise<LintingResult> => {
  const test = "Using an Astro Color";
  const name = node.name;
  const fillStyleId = node.fillStyleId;
  let pass = false;
  let message = "";

  const testResult: LintingResult = {
      test,
      pass,
      message,
      name,
      node,
    };

  return new Promise((resolve) => {
    if (!fillStyleId) {
      return resolve({
        ...testResult,
        ignore: true,
        pass: true,
        message: `Node cannot have a fill`,
      });
    }

    if (typeof fillStyleId !== "string") {
      return resolve({
        ...testResult,
        pass: false,
        message: `Node is not using a fill style from Astro`,
      });
    }

    if (fillStyleId && typeof fillStyleId === "string") {
      const token = colorTokens.get(stripToLoadableId(fillStyleId));
      pass = !!token;
      message = pass
        ? `Node is using a fill style from Astro (${token?.name})`
        : `Node is using a fill style but it's not from Astro`;

      return resolve({
        ...testResult,
        pass,
        message,
      });
    }

    // Fallback: check for manual fills
    const fills = node.fills;
    if (Array.isArray(fills) && fills.length > 0) {
      const visibleFills = fills.filter((fill) => fill.visible === true);
      if (visibleFills.length === 0) {
        return resolve({
          ...testResult,
          pass: true,
          message: `Node is filled invisibly`,
        });
      }
      return resolve({
        ...testResult,
        pass: false,
        message: `Node is filled but not using a fill style from Astro`,
      });
    }

    return resolve({
      ...testResult,
      pass: true,
      message: `Node is not using a fill style`,
    });
  });
};

export { usingAstroColor };
