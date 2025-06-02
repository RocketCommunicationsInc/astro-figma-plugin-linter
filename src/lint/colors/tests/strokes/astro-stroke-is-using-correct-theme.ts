import { AstroTheme } from "../../../../types/tokens";
import { FillStyleNode } from "../../../../types/figma";
import { LintingResult } from "../../../../types/results";
import { stripToLoadableId } from "../../../../tokens";
import { tokens } from "../../../../tokens";
const { colorTokens } = tokens();

const astroStrokeIsUsingCorrectTheme = (
  node: FillStyleNode,
  theme: AstroTheme
): Promise<LintingResult> => {
  return new Promise((resolve) => {
    const test = "Using Astro Color Stroke in Correct Theme";
    const name = node.name;
    const strokeStyleId = (node.strokeStyleId as string) || "";
    const astroColor = colorTokens.get(stripToLoadableId(strokeStyleId));
    const strokes = node.strokes;
    const pass = false;
    const message = "";

    const testResult: LintingResult = {
      test,
      id: `${test}-0`,
      pass,
      message,
      name,
      node,
      type: node.type,
    };

    // Switch logic based on node state
    switch (true) {
      case !!astroColor?.name: {
        const astroColorNameWithTheme = `${theme}/${astroColor?.name}`;
        const astroColorWithTheme = colorTokens.get(astroColorNameWithTheme);
        const pass = astroColor?.id === astroColorWithTheme?.id;
        // message = pass
        //   ? `Node is using a stroke style (${astroColor.name}) from Astro in the correct theme (${theme})`
        //   : `Node is using a stroke style (${astroColor.name}) from Astro but it's not the correct theme (${theme})`;
        resolve({
          ...testResult,
          id: `${test}-1`,
          pass: pass,
          message: pass
            ? `Node is using a stroke style (${astroColor.name}) from Astro in the correct theme (${theme})`
            : `Node is using a stroke style (${astroColor.name}) from Astro but it's not the correct theme (${theme})`,
        });
        break;
      }

      case Array.isArray(strokes) && strokes.length === 0: {
        // pass = true;
        // message = `Node has no strokes`;
        resolve({
          ...testResult,
          id: `${test}-2`,
          pass: true,
          message: `Node has no strokes`,
        });
        break;
      }

      case Array.isArray(strokes) && strokes.length > 0: {
        const visibleStrokes = strokes.filter(
          (stroke) => stroke.visible === true
        );
        if (visibleStrokes.length === 0) {
          resolve({
            ...testResult,
            id: `${test}-3`,
            pass: true,
            message: `Node has an invisible stroke`,
          });
          return;
        }
        break;
      }

      case !strokeStyleId: {
        resolve({
          ...testResult,
          id: `${test}-4`,
          ignore: true,
          pass: true,
          message: `Node is not using a stroke style`,
        });
        return;
      }

      default: {
        resolve({
          ...testResult,
          id: `${test}-5`,
          message: `Node is not using a stroke style from Astro`,
        });
        return;
      }
    }

    resolve({
      ...testResult,
      message: `An unexpected error occurred when linting strokes`,
    });
  });
};

export { astroStrokeIsUsingCorrectTheme };
