import { FillStyleNode } from "../../types";
import { LintingResult } from "../types";
import { stripToLoadableId } from "../../tokens";
import { tokens } from "../../tokens";
import { AstroComponent } from "../components/types";
const { colorTokens } = tokens();

const testIfUsingColorFromComponent = (
  node: FillStyleNode,
  sourceCounterpartNode: FillStyleNode | undefined
): LintingResult => {
  let fillMatchesAstroSource = false;

  if (sourceCounterpartNode) {
    // Is this node using a paint style in the source Astro component?
    const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
    const sourceFillStyleId =
      "fillStyleId" in sourceCounterpartNode
        ? sourceCounterpartNode.fillStyleId
        : undefined;
    fillMatchesAstroSource = fillStyleId === sourceFillStyleId;
  }
  return {
    test: "testIfUsingColorFromComponent",
    pass: fillMatchesAstroSource,
    message: `Node should be using a fill style from the source Astro component: ${sourceCounterpartNode?.name}`,
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
    console.log("hi there");
    return {
      test,
      pass: false,
      message: `Node should be using a fill style from Astro`,
      name,
      node,
    };
  }

  let isUsingAstroColor = false;
  if (fillStyleId) {
    isUsingAstroColor = colorTokens.get(stripToLoadableId(fillStyleId))
      ? true
      : false;
    return {
      test,
      pass: isUsingAstroColor,
      message: `Node should be using a fill style from Astro`,
      name,
      node,
    };
  } else {
    // check for manual fills
    const fills = node.fills;
    if (Array.isArray(fills) && fills.length > 0) {
      return {
        test,
        pass: false,
        message: `Node is not using a fill style from Astro`,
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

const testPaintStyle = (
  node: FillStyleNode,
  sourceAstroComponent: ComponentNode | ComponentSetNode | null,
  astroComponentMeta: AstroComponent | undefined,
  sourceCounterpartNode: ComponentNode | null
) => {
  // Fail if node is in a component and not using the correct paint style
  if (sourceCounterpartNode) {
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
};

export { testPaintStyle };
