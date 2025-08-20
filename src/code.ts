import { lintSelection } from "./lint";
import { AstroTheme } from "./types/tokens";
import { resolveContrastRequest } from "./lint/parsing-promises/contrast-request-manager";
import { ContrastResults } from "./types/results";

figma.showUI(__html__, { themeColors: true, width: 550, height: 700 });

interface PluginMessage {
  type: string;
  theme?: AstroTheme;
  nodeId?: string;
  contrastResults?: ContrastResults;
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: PluginMessage) => {
  
  if (msg.type === "lint-selection") {
    console.clear();
    figma.notify("Linting Selection...");
    if (msg.theme) {
      lintSelection(msg.theme);
    } else {
      figma.notify("No theme provided for linting.");
    }
  }

  if (msg.type === "select-node") {
    if (msg.nodeId) {
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
    } else {
      figma.notify("No nodeId provided for selection.");
    }
  }

  if (msg.type === "color-contrast-data") {
    if (msg.nodeId && msg.contrastResults) {
      resolveContrastRequest(msg.nodeId, msg.contrastResults);
    }
  }
};
