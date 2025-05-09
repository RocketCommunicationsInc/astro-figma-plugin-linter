import { FillStyleNode } from "./types";
import { tokens, stripToLoadableId } from "./tokens";
import { getSourceAstroComponent } from "./lint/components";
import { canNodeHaveFillStyle, isUsingPaintStyle, findFillStyleNodes } from "./lint/colors";

const { colorTokens, typeTokens, astroComponents } = tokens();

const lintSingleNode = async (node: FillStyleNode) => {
  console.log("lintSingleNode", node);

  // Check if the node is a valid type
  if (canNodeHaveFillStyle(node)) {
    // Is this node part of an Astro component?
    let sourceAstroComponent: ComponentNode | ComponentSetNode | null = null;
    if (node.type === "INSTANCE") {
      sourceAstroComponent = await getSourceAstroComponent(node);
    }
    console.log("sourceAstroComponent", sourceAstroComponent);

    // todo: Check if node is using a paint style
    // todo: Fail if node is in a component and not using the correct paint style
    // todo: Fail if node is not in a component AND not using a paint style
    // todo: Fail if node is not in a component AND using a paint style not from Astro
    // todo: Check if the Astro component has a fill Style
    const passUsingPaintStyle =
      isUsingPaintStyle(node) && node.fillStyleId !== "" ? true : false;
    console.log("passUsingPaintStyle", passUsingPaintStyle);

    // todo: Fail if node is not using an Astro paint style
    // if (passUsingPaintStyle) {
    const fillStyleId = "fillStyleId" in node ? node.fillStyleId : undefined;
    const loadableId =
      fillStyleId && typeof fillStyleId === "string"
        ? stripToLoadableId(fillStyleId)
        : "";
    const passUsingPaintStyleFromAstroToken = colorTokens.get(loadableId)
      ? true
      : false;
    console.log(
      "passUsingPaintStyleFromAstroToken",
      passUsingPaintStyleFromAstroToken
    );
    // }

    // todo: Pass if node is using an Astro paint style but not as part of an Astro component


    // todo: Fail if node is using an Astro paint style but not the correct one for this component

    // todo: Fail if node is using an Astro paint style but not the correct one for this theme
    // todo: Pass if node is using an Astro paint style and the correct one for this component
  }
};

const lintSelectionChild = async (node: FillStyleNode) => {
  console.log("lintSelectionChild", node);

  // First lint the node itself
  lintSingleNode(node);

  // Then lint any children
  // todo: check chidren before failing

  return;

  // if ("findAll" in node) {
  //   // Find all nodes with a fillStyleId
  //   const nodesWithFillStyle = node.findAll(
  //     (n): n is SceneNode & InheritedStyleField => canNodeHaveFillStyle(n)
  //   );
  //   console.log("Nodes with fillStyleId:", nodesWithFillStyle);
  //   nodesWithFillStyle.map(async (n) => {
  //     // console.log('n', n.name)

  //     // console.log(["paintableNode", n]);
  //   });

  //   // Find all nodes with a strokeStyleId
  //   // Find all nodes with a typeStyleId
  //   // todo: check if node is using a text style.
  //   // todo: Fail if text is not using a text style
  //   // todo: Fail if text is not using an Astro text style
  //   // todo: Fail if text is using an Astro text style but not the correct one for this component
  //   // todo: Pass if text is using an Astro text style and the correct one for this component
  // }
};

const lintSelection = async () => {
  console.clear();

  const selection = figma.currentPage.selection;
  const fillStyleNodes = findFillStyleNodes(selection);

  // Check if there are any selected nodes
  if (fillStyleNodes.length === 0) {
    console.log("No nodes selected");
    return;
  } else if (fillStyleNodes.length === 1) {
    console.log("Linting single node");
    lintSelectionChild(fillStyleNodes[0]);
  } else {
    console.log("Linting multiple nodes");
    fillStyleNodes.map((node) => {
      lintSelectionChild(node);
    });
  }

  figma.notify("Linting complete");
};
// Listen for messages from the UI
export { lintSelection };
