import { exportColorStyles } from "./export/export-color-styles";

figma.showUI(__html__, { themeColors: true, width: 650, height: 525 });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: { type: string; count: number }) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  console.log("got this from the UI", msg);
  figma.notify("Received message from UI: " + msg.type);

  if (msg.type === "export-color") {
    figma.notify("Exporting color styles...");
    exportColorStyles();
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
