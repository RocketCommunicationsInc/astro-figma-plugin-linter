import { lintSelection } from "./lint";
import { AstroTheme } from "./lint/types";

figma.showUI(__html__, { themeColors: true });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: { type: string; theme: AstroTheme }) => {
  console.clear();

  if (msg.type === "lint-selection") {
    figma.notify("Linting Selection...");
    lintSelection(msg.theme);
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
