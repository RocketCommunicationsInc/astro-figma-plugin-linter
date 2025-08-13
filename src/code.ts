import { lintSelection } from "./lint";
import { AstroTheme } from "./types/tokens";
import { LintingResult } from "./types/results";
import { resolveRequest } from "./lint/parsing-promises/contrast-request-manager";

figma.showUI(__html__, { themeColors: true, width: 550, height: 700 });

interface PluginMessage {
  type: string;
  theme?: AstroTheme;
  nodeId?: string;
  colorData?: LintingResult;
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: PluginMessage) => {
  
  if (msg.type === "lint-selection") {
    console.clear();
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

  if (msg.type === "color-contrast-data") {
    console.log('msg', msg)
    if (msg.nodeId && msg.colorData) {
      resolveRequest(msg.nodeId, msg.colorData);
    }
  }
};
