import { LintingResult } from "../../../types/results";
import { getTypographyAttributes } from "../helpers/get-typography-attributes";

interface UsingAstroType {
  (node: TextNode): Promise<LintingResult>;
}

const usingAstroType: UsingAstroType = (node) => {
  return new Promise((resolve) => {
    (async () => {
      const test = "Using an Astro Typography Token";
      const name = node.name;
      const pass = false;
      const message = "";
      const { usedTypography, usedTypographyType } =
        await getTypographyAttributes(node);

      const testResult: LintingResult = {
        test,
        id: `${test}-0`,
        testType: "typography",
        pass,
        message,
        name,
        node,
        nodeType: node.type,
        usedTypography,
      };

      switch (true) {
        case !!usedTypography && usedTypographyType === "astroToken": {
          // If the usedTypography is a Typography Token
          resolve({
            ...testResult,
            id: `${test}-1`,
            pass: true,
            message: "Layer is using a typography token from Astro.",
          });
          break;
        }

        case !!usedTypography && usedTypographyType === "typeStyle": {
          // If the usedTypography is a TypographyStyle but not an Astro Typography Token
          // This means the node is using a type style but not from Astro
          resolve({
            ...testResult,
            id: `${test}-2`,
            pass: false,
            message: "Layer is using a typography style not from Astro.",
          });
          break;
        }

        case !!usedTypography && usedTypographyType === "manual": {
          // If the usedTypography is manually set
          resolve({
            ...testResult,
            id: `${test}-3`,
            pass: false,
            message: "Layer is using manually set typography.",
          });
          break;
        }

        default: {
          resolve({
            ...testResult,
            message: `An unexpected error occurred when linting fills`,
          });
        }
      }
    })();
  });
};

export { usingAstroType };
