import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { stripToLoadableId } from "../../../../tokens";
import { tokens } from "../../../../tokens";
const { colorTokens } = tokens();

const usingAstroFill = (node: FillStyleNode): Promise<LintingResult> => {
  const test = "Using an Astro Color Fill";
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
    const fills = node.fills;

    switch (true) {
      case !fillStyleId: {
        resolve({
          ...testResult,
          ignore: true,
          pass: true,
          message: `Node cannot have a fill`,
        });
        break;
      }

      case typeof fillStyleId !== "string": {
        resolve({
          ...testResult,
          pass: false,
          message: `Node is not using a fill style from Astro`,
        });
        break;
      }

      case !!fillStyleId && typeof fillStyleId === "string": {
        const token = colorTokens.get(stripToLoadableId(fillStyleId));
        pass = !!token;
        message = pass
          ? `Node is using a fill style from Astro (${token?.name})`
          : `Node is using a fill style but it's not from Astro`;
        resolve({
          ...testResult,
          pass,
          message,
        });
        break;
      }

      case Array.isArray(fills) && fills.length > 0: {
        const visibleFills = fills.filter((fill) => fill.visible === true);
        if (visibleFills.length === 0) {
          resolve({
            ...testResult,
            pass: true,
            message: `Node is filled invisibly`,
          });
        } else {
          resolve({
            ...testResult,
            pass: false,
            message: `Node is filled but not using a fill style from Astro`,
          });
        }
        break;
      }

      default: {
        resolve({
          ...testResult,
          pass: true,
          message: `Node is not using a fill style`,
        });
      }
    }
  });
};

export { usingAstroFill };
