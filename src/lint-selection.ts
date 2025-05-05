import { InheritedStyleField, hasInheritedStyleField } from "./types";
import { tokens, stripToLoadableId } from "./tokens";

const lintSelection = async () => {
  console.clear();
  const { colorTokens, typeTokens } = tokens();

  const selection = figma.currentPage.selection;
  console.log("selection", selection);

  // Check if there are any selected nodes
  if (selection.length === 0) {
    figma.notify("No nodes selected");
    return;
  }


  selection.map((node) => {
    if ("findAll" in node) {
      // Find all nodes with a fillStyleId
      const nodesWithFillStyle = node.findAll(
        (n): n is SceneNode & InheritedStyleField =>
          hasInheritedStyleField(n, "fillStyleId")
      );
      console.log("Nodes with fillStyleId:", nodesWithFillStyle);
      nodesWithFillStyle.map((n) => {
        console.log('n', n.name)
        const usingPaintStyle =
          "fillStyleId" in n &&
          typeof n.fillStyleId === "string" &&
          n.fillStyleId
            ? true
            : false;

        // todo: Check if node is using a paint style
        // todo: Fail if node is not using a paint style
        console.log('usingPaintStyle', usingPaintStyle)

        // todo: Fail if node is not using an Astro paint style
        if (usingPaintStyle) {
          const fillStyleId = "fillStyleId" in n ? n.fillStyleId : undefined;
          const loadableId = fillStyleId && typeof fillStyleId === "string" ? stripToLoadableId(fillStyleId) : "";
          const fromToken = (colorTokens.get(loadableId)) ? true : false;
          console.log('fromToken', fromToken)
        }

        // todo: Fail if node is using an Astro paint style but not the correct one for this component


        // todo: Fail if node is using an Astro paint style but not the correct one for this theme
        // todo: Pass if node is using an Astro paint style and the correct one for this component
        // console.log(["paintableNode", n]);
      });

      // Find all nodes with a strokeStyleId
      // Find all nodes with a typeStyleId
      // todo: check if node is using a text style.
      // todo: Fail if text is not using a text style
      // todo: Fail if text is not using an Astro text style
      // todo: Fail if text is using an Astro text style but not the correct one for this component
      // todo: Pass if text is using an Astro text style and the correct one for this component
    }
  });

  figma.notify("Linting complete");
};
// Listen for messages from the UI
export { lintSelection };
