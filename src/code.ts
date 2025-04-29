import { exportColorStyles } from "./export/export-color-styles";
import { exportTypeStyles } from "./export/export-type-styles";

figma.showUI(__html__, { themeColors: true, width: 650, height: 525 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: { type: string; count: number }) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.

  if (msg.type === "export-color") {
    figma.notify("Exporting color styles...");
    exportColorStyles();
  }

  if (msg.type === "export-type") {
    figma.notify("Exporting text styles...");
    exportTypeStyles();
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
