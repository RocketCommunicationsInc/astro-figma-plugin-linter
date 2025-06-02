import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { stripToLoadableId } from "../../../../tokens";
import { tokens } from "../../../../tokens";
const { colorTokens } = tokens();

const usingAstroStroke = (node: FillStyleNode): Promise<LintingResult> => {
  const test = "Using an Astro Color Stroke";
  const name = node.name;
  const strokeStyleId = node.strokeStyleId;
  let pass = false;
  let message = "";

  const testResult: LintingResult = {
    test,
    id: `${test}-0`,
    pass,
    message,
    name,
    node,
    type: node.type,
  };

  return new Promise((resolve) => {
    const strokes = node.strokes;

    switch (true) {
      case !strokeStyleId: {
        resolve({
          ...testResult,
          id: `${test}-1`,
          ignore: true,
          pass: true,
          message: `Node is not using a stroke style`,
        });
        break;
      }

      case typeof strokeStyleId !== "string": {
        resolve({
          ...testResult,
          id: `${test}-2`,
          pass: false,
          message: `Node is not using a fill style from Astro`,
        });
        break;
      }

      case !!strokeStyleId && typeof strokeStyleId === "string": {
        const token = colorTokens.get(stripToLoadableId(strokeStyleId));
        pass = !!token;
        message = pass
          ? `Node is using a stroke style from Astro (${token?.name})`
          : `Node is using a stroke style but it's not from Astro`;
        resolve({
          ...testResult,
          id: `${test}-3`,
          pass,
          message,
        });
        break;
      }

      case Array.isArray(strokes) && strokes.length > 0: {
        const visibleStrokes = strokes.filter((stroke) => stroke.visible === true);
        if (visibleStrokes.length === 0) {
          resolve({
            ...testResult,
            id: `${test}-4`,
            pass: true,
            message: `Node has an invisible stroke`,
          });
        } else {
          resolve({
            ...testResult,
            id: `${test}-5`,
            pass: false,
            message: `Node has a stroke but not using a color style from Astro`,
          });
        }
        break;
      }

      default: {
        resolve({
          ...testResult,
          id: `${test}-6`,
          pass: true,
          message: `Node is not using a stroke style`,
        });
      }
    }
  });
};

export { usingAstroStroke };
