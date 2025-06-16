import { LintingResult } from "../../../types/results";
import { getInstanceOverride } from "../../collect-data/overrides";
import { getAssociation } from "../../collect-data/associations";
import { getTypographyAttributes } from "../helpers/get-typography-attributes";

interface UsingTypeFromComponent {
  (node: TextNode): Promise<LintingResult>;
}

const usingTypeFromComponent: UsingTypeFromComponent = (node) => {
  return new Promise((resolve) => {
    (async () => {
      // This test checks if the node is using a fill style from the source Astro component.
      // It checks for overrides and compares the fill style with the source Astro component.
      const test = "Using Color Typography from a Component";
      const name = node.name;
      const pass = false;
      const message = "";
      let correspondingTypographyStatus: string = "";

      const instanceOverrides = getInstanceOverride(node.id);
      const overriddenFields = instanceOverrides || null;

      const association = getAssociation(node.id);
      const {
        directLibraryCounterpartNode,
        correspondingAstroNodeFromLibrary,
      } = association || {};

      const { usedTypography } = await getTypographyAttributes(node);

      let correspondingTypography: typeof usedTypography | undefined;
      if (
        correspondingAstroNodeFromLibrary &&
        correspondingAstroNodeFromLibrary.type === "TEXT"
      ) {
        const result = await getTypographyAttributes(
          correspondingAstroNodeFromLibrary
        );
        correspondingTypography = result.usedTypography;
      } else {
        correspondingTypography = undefined;
      }

      correspondingTypographyStatus = correspondingAstroNodeFromLibrary
        ? "No typography style found in the library Astro component"
        : "Could not determine the typography style from the library Astro component";

      const testResult: LintingResult = {
        test,
        id: `${test}-0`,
        testType: "typography",
        pass,
        message,
        name,
        node,
        nodeType: node.type,
        directLibraryCounterpartNode,
        usedTypography,
        correspondingTypography,
        correspondingTypographyStatus,
      };

      const possibleOverriddenFields = [
        "textStyleId",
        "fontWeight",
        "fontName",
        "fontSize",
        "leadingTrim",
        "letterSpacing",
        "lineHeight",
        "listSpacing",
        "paragraphIndent",
        "paragraphSpacing",
        "textCase",
        "textDecoration",
      ];

      switch (true) {
        case !!overriddenFields &&
          overriddenFields.some((item) =>
            possibleOverriddenFields.includes(item)
          ): {
          resolve({
            ...testResult,
            id: `${test}-1`,
            pass: false,
            message:
              "Node is not using the same typography as the source Astro component.",
          });
          break;
        }

        case !overriddenFields: {
          resolve({
            ...testResult,
            id: `${test}-2`,
            pass: true,
            message:
              "Node is using the same text style as the source Astro component.",
          });
          break;
        }

        default: {
          resolve({
            ...testResult,
            id: `${test}-3`,
            ignore: true,
            pass: true,
            message: "Something is overridden, but not textStyleId.",
          });
          break;
        }
      }
    })();
  });
};

export { usingTypeFromComponent };
