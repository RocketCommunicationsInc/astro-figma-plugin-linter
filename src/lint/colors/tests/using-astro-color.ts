import { FillStyleNode } from "../../../types";
import { LintingResult } from "../../types";
import { stripToLoadableId } from "../../../tokens";
import { tokens } from "../../../tokens";
const { colorTokens } = tokens();

const usingAstroColor = (node: FillStyleNode): Promise<LintingResult> => {
  const test = "Using an Astro Color";
  const name = node.name;
  const fillStyleId = node.fillStyleId;

  return new Promise((resolve) => {
    if (!fillStyleId) {
      return resolve({
        ignore: true,
        test,
        pass: true,
        message: `Node cannot have a fill`,
        name,
        node,
      });
    }

    if (typeof fillStyleId !== "string") {
      return resolve({
        test,
        pass: false,
        message: `Node is not using a fill style from Astro`,
        name,
        node,
      });
    }

    if (fillStyleId && typeof fillStyleId === "string") {
      const token = colorTokens.get(stripToLoadableId(fillStyleId));
      const pass = !!token;
      const message = pass
        ? `Node is using a fill style from Astro (${token?.name})`
        : `Node is using a fill style but it's not from Astro)`;

      return resolve({
        test,
        pass,
        message,
        name,
        node,
      });
    }

    // Fallback: check for manual fills
    const fills = (node as any).fills;
    if (Array.isArray(fills) && fills.length > 0) {
      const visibleFills = fills.filter((fill) => fill.visible === true);
      if (visibleFills.length === 0) {
        return resolve({
          test,
          pass: true,
          message: `Node is filled invisibly`,
          name,
          node,
        });
      }
      return resolve({
        test,
        pass: false,
        message: `Node is filled but not using a fill style from Astro`,
        name,
        node,
      });
    }

    return resolve({
      test,
      pass: true,
      message: `Node is not using a fill style`,
      name,
      node,
    });
  });
};

export { usingAstroColor };
