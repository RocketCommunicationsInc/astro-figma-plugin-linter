import { lintSelection } from "./lint";
import { AstroTheme } from "./types/tokens";

figma.showUI(__html__, { themeColors: true, width: 500, height: 600 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: { type: string; theme: AstroTheme, nodeId: string }) => {
  console.clear();

  if (msg.type === "lint-selection") {
    figma.notify("Linting Selection...");
    lintSelection(msg.theme);
  }

  if (msg.type === "select-node") {
    figma.getNodeByIdAsync(msg.nodeId).then((node) => {
      if (node) {
        figma.viewport.scrollAndZoomIntoView([node]);
        node.setRelaunchData({ open: "true" });
        if ("type" in node && (node as SceneNode).visible !== undefined) {
          figma.currentPage.selection = [node as SceneNode];
        }
      }
      figma.notify("Node Found");
    });
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
