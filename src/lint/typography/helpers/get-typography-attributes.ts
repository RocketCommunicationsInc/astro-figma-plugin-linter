import { stripToLoadableId, tokens } from "../../../tokens";

type UsedTypographyResult = {
  usedTypography: TextStyle | StyledTextSegment;
  usedTypographyType: "astroToken" | "typeStyle" | "manual";
  usedTypographyAttributes: StyledTextSegment[];
  };

interface GetTypographyAttributes {
  (node: TextNode): Promise<UsedTypographyResult>;
}

const getTypographyAttributes: GetTypographyAttributes = async (node) => {
  return new Promise((resolve) => {
    // 1. Using an Astro Typography Token
    // 2. Using a Figma Typography Style (not an Astro Token)
    // 3. Using a Figma Typography (not a style, manual settings)

    (async () => {
      const { typeTokens } = tokens();
      const textStyleId = "textStyleId" in node ? node.textStyleId : null;

      const astroToken =
        typeof textStyleId === "string"
          ? typeTokens.get(stripToLoadableId(textStyleId))
          : null;
      const typographyFragments = node.getStyledTextSegments([
        "fontName",
        "fontSize",
        "fontWeight",
        "letterSpacing",
        "lineHeight",
        "listSpacing",
        "paragraphIndent",
        "paragraphSpacing",
        "textCase",
        "textDecoration",
      ]) as StyledTextSegment[];

      const typography = typographyFragments[0];

      switch (true) {
        case !!astroToken: {
          // If the typography is a TypographyToken
          resolve({
            usedTypography: astroToken,
            usedTypographyType: "astroToken",
            usedTypographyAttributes: typographyFragments,
          });
          break;
        }

        case !!textStyleId && !astroToken: {
          // If the typography is a TypographyToken
          // load the TypeStyle from the styleId
          let typographyStyleName;
          if (typeof textStyleId === "string") {
            typographyStyleName = await figma.getStyleByIdAsync(textStyleId);
          }
          const newTypography = {
            ...typography,
            typographyStyleName: typographyStyleName?.name || undefined,
          };
          resolve({
            usedTypography: newTypography,
            usedTypographyType: "typeStyle",
            usedTypographyAttributes: typographyFragments,
          });
          break;
        }

        default: {
          // If the color is a Figma values (not a TypographyToken)
          resolve({
            usedTypography: typography,
            usedTypographyType: "manual",
            usedTypographyAttributes: typographyFragments,
          });
        }
      }
    })();
  });
};

export {
  getTypographyAttributes,
  UsedTypographyResult
};
