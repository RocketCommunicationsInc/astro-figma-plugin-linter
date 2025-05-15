import { FillStyleNode } from "../../types";
import { LintingResult, AstroTheme } from "../types";
import { stripToLoadableId } from "../../tokens";
import { tokens } from "../../tokens";
import { AstroComponent } from "../components/types";
const { colorTokens } = tokens();

const testIfUsingColorFromComponent = (
  node: FillStyleNode,
  sourceCounterpartNode: FillStyleNode | undefined
): LintingResult => {
  let pass = false;

  if (sourceCounterpartNode) {
    // Is this node using a paint style in the source Astro component?
    const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
    const sourceFillStyleId =
      "fillStyleId" in sourceCounterpartNode
        ? sourceCounterpartNode.fillStyleId
        : undefined;
    pass = fillStyleId === sourceFillStyleId;
  }
  const message = (pass) ?
    `Node is using the same fill style as the source Astro component: ${sourceCounterpartNode?.name}` :
    `Node is not using the same fill style as the source Astro component: ${sourceCounterpartNode?.name}`;
  return {
    test: "testIfUsingColorFromComponent",
    pass,
    message,
    name: node.name,
    node: node,
    sourceCounterpartNode: sourceCounterpartNode,
  };
};

const testIfUsingAstroColor = (node: FillStyleNode): LintingResult => {
  const test = "testIfUsingAstroColor";
  const name = node.name;
  const fillStyleId = node.fillStyleId;

  if (typeof fillStyleId !== "string") {

    return {
      test,
      pass: false,
      message: `Node is not using a fill style from Astro`,
      name,
      node,
    };
  }

  if (fillStyleId) {
    const pass = colorTokens.get(stripToLoadableId(fillStyleId))
      ? true
      : false;
    const message = (pass) ?
      `Node is using a fill style from Astro (${colorTokens.get(stripToLoadableId(fillStyleId))?.name})` :
      `Node is using a fill style but it's not from Astro)`;
    return {
      test,
      pass,
      message,
      name,
      node,
    };
  } else {
    // check for manual fills
    const fills = node.fills;
    if (Array.isArray(fills) && fills.length > 0) {
      const visibleFills = fills.filter((fill) => {
        return fill.visible === true;
      });
      if (visibleFills.length === 0) {
        return {
          test,
          pass: true,
          message: `Node is filled invisibly`,
          name,
          node,
        };
      }
      return {
        test,
        pass: false,
        message: `Node is filled but not using a fill style from Astro`,
        name,
        node,
      };
    } else {
      return {
        test,
        pass: true,
        message: `Node is not using a fill style`,
        name,
        node,
      };
    }
  }
};

const testIfAstroColorIsUsingCorrectTheme = (
  node: FillStyleNode,
  theme: AstroTheme
): LintingResult => {
  const test = "testIfAstroColorIsUsingCorrectTheme";
  const name = node.name;
  const fillStyleId = (node.fillStyleId as string) || "";
  const astroColor = colorTokens.get(stripToLoadableId(fillStyleId));
  const astroColorNameWithTheme = `${theme}/${astroColor?.name}`;
  const astroColorWithTheme = colorTokens.get(astroColorNameWithTheme);
  const pass = (astroColor?.id === astroColorWithTheme?.id) ? true : false;
  const message = (pass) ?
    `Node is using a fill style (${astroColor.name}) from Astro but it's not the correct theme (${theme})` :
    `Node is using a fill style (${astroColor.name}) from Astro in the correct theme (${theme})`;
  return {
    test,
    pass,
    message,
    name,
    node,
  };
}

const testPaintStyle = (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null,
  astroComponentMeta: AstroComponent | undefined,
  sourceCounterpartNode: ComponentNode | null,
  theme: AstroTheme
) => {
  // Fail if node is in a component and not using the correct paint style
  if (sourceAstroComponent && sourceCounterpartNode) {
    const isUsingColorFromComponent = testIfUsingColorFromComponent(
      node,
      sourceCounterpartNode
    );
    console.warn("isUsingColorFromComponent", isUsingColorFromComponent);
  } else {
    // Fail if node is not in an Astro component,
    // IS using a fill style,
    // AND not using an Astro paint style
    // const fillStyleId = node.fillStyleId;
    // const isUsingAstroColorIfUsingColor =
    //   typeof fillStyleId === "string" ? testIfUsingAstroColor(fillStyleId) : false;
    const isUsingAstroColorIfUsingColor = testIfUsingAstroColor(node);
    console.warn(
      "isUsingAstroColorIfUsingColor",
      isUsingAstroColorIfUsingColor
    );
  }

  // todo: Fail if node is using an Astro paint style but not the correct one for this theme
  const isAstroColorIsUsingCorrectTheme =
    testIfAstroColorIsUsingCorrectTheme(node, theme);
  console.warn(
    "isAstroColorIsUsingCorrectTheme",
    isAstroColorIsUsingCorrectTheme
  );
};

export { testPaintStyle };
