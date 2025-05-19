import { FillStyleNode } from "../../../types";
import { LintingResult } from "../../types";
import { stripToLoadableId } from "../../../tokens";
import { tokens } from "../../../tokens";
const { colorTokens } = tokens();

const usingAstroColor = (node: FillStyleNode): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "usingAstroColor";
    const name = node.name;
    const fillStyleId = node.fillStyleId;

    if (typeof fillStyleId !== "string") {
      resolve({
        test,
        pass: false,
        message: `Node is not using a fill style from Astro`,
        name,
        node,
      });
    }

    if (fillStyleId && typeof fillStyleId === "string") {
      const pass = colorTokens.get(stripToLoadableId(fillStyleId))
        ? true
        : false;
      const message = pass
        ? `Node is using a fill style from Astro (${
            colorTokens.get(stripToLoadableId(fillStyleId))?.name
          })`
        : `Node is using a fill style but it's not from Astro)`;
      resolve({
        test,
        pass,
        message,
        name,
        node,
      });
    } else {
      // check for manual fills
      const fills = node.fills;
      if (Array.isArray(fills) && fills.length > 0) {
        const visibleFills = fills.filter((fill) => {
          return fill.visible === true;
        });
        if (visibleFills.length === 0) {
          resolve({
            test,
            pass: true,
            message: `Node is filled invisibly`,
            name,
            node,
          });
        }
        resolve({
          test,
          pass: false,
          message: `Node is filled but not using a fill style from Astro`,
          name,
          node,
        });
      } else {
        resolve({
          test,
          pass: true,
          message: `Node is not using a fill style`,
          name,
          node,
        });
      }
    }
  });
};

export { usingAstroColor };
