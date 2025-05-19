import { lintSelection } from "./lint";
import { AstroTheme } from "./lint/types";

figma.showUI(__html__, { themeColors: true, width: 600, height: 800 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: { type: string; theme: AstroTheme, nodeID: string }) => {
  console.clear();

  if (msg.type === "lint-selection") {
    figma.notify("Linting Selection...");
    lintSelection(msg.theme);
  }

  if (msg.type === "select-node") {
    console.log("Finding Node...", msg);
    const node = figma.getNodeByIdAsync(msg.nodeId).then((node) => {
      if (node) {
        console.log('node', node)
        figma.viewport.scrollAndZoomIntoView([node]);
        node.setRelaunchData({ open: "true" });
        figma.currentPage.selection = [node];
      }
      figma.notify("Node Found");
    });
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
