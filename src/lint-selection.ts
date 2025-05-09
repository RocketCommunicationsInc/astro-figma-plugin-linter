import { FillStyleNode } from "./types";
import { tokens, stripToLoadableId } from "./tokens";

const { colorTokens, typeTokens, astroComponents } = tokens();

const findFillStyleNodes = (nodes: readonly SceneNode[]): FillStyleNode[] => {
  return nodes.filter((node): node is FillStyleNode =>
    canNodeHaveFillStyle(node)
  );
};

const canNodeHaveFillStyle = (node: SceneNode): boolean => {
  // List of node types that support fillStyleId
  const fillStyleSupportedTypes: NodeType[] = [
    "RECTANGLE",
    "ELLIPSE",
    "POLYGON",
    "STAR",
    "VECTOR",
    "TEXT",
    "FRAME",
    "COMPONENT",
    "INSTANCE",
  ];

  return fillStyleSupportedTypes.includes(node.type);
};

const isUsingPaintStyle = (node: FillStyleNode) => {
  // Check if the node is using a paint style
  const usingPaintStyle =
    "fillStyleId" in node &&
    typeof node.fillStyleId === "string" &&
    node.fillStyleId
      ? true
      : false;
  return usingPaintStyle;
};

const componentLoaderFunction: (
  componentType: string,
  key: string
) => Promise<ComponentNode | ComponentSetNode | null> = (
  componentType: string,
  key: string
) => {
  switch (componentType) {
    case "COMPONENT":
      return figma.importComponentByKeyAsync(key);
    case "COMPONENT_SET":
      return figma.importComponentSetByKeyAsync(key);
    default:
      console.error("Unknown component type");
      return Promise.resolve(null);
  }
};

interface AstroComponent {
  type: "COMPONENT" | "COMPONENT_SET";
  key: string;
}

const getSourceAstroComponent = async (node: InstanceNode): Promise<ComponentNode | ComponentSetNode | null> => {
  const mainComponent = await node.getMainComponentAsync();

  const mainComponentKey: string | undefined = mainComponent?.key;
  // Check if mainComponent is one of the Astro components in components
  let isAstroComponent: AstroComponent | undefined = astroComponents.get(mainComponentKey);
  if (!isAstroComponent && mainComponent?.parent?.type === "COMPONENT_SET") {
    const mainComponentParentKey: string | undefined = mainComponent?.parent?.key;
    isAstroComponent = astroComponents.get(mainComponentParentKey);
  }

  if (!isAstroComponent) {
    console.log("Not an Astro component");
    return null;
  }

  // Load the Astro component from Figma
  const astroComponent = await componentLoaderFunction(
    isAstroComponent.type,
    isAstroComponent.key
  );
  return astroComponent;
};

const lintSingleNode = async (node: FillStyleNode) => {
  console.log("lintSingleNode", node);

  // Check if the node is a valid type
  if (canNodeHaveFillStyle(node)) {
    // todo: Check if node is using a paint style
    // todo: Fail if node is not using a paint style
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
    // Is this node part of an Astro component?
    if (node.type === "INSTANCE") {
      console.log("Is this node part of an Astro component?", node.name, node);

      const sourceAstroComponent = await getSourceAstroComponent(node);
      console.log("sourceAstroComponent", sourceAstroComponent);
    }

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
