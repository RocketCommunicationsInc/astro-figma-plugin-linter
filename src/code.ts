figma.showUI(__html__, { themeColors: true, width: 650, height: 425 });

const exportColorStyles = async () => {
  console.clear();
  const paintStyles = await figma.getLocalPaintStylesAsync().then(
    (paintStyles) => paintStyles,
    (error) => {
      console.error("Error fetching local paint styles:", error);
      return [];
    }
  );

  const tokensJSON = {
    "color-tokens": {
      [ "dark" ]: {},
      [ "light" ]: {},
    },
  };

  const paintStylesJSON: {
    [key: string]: {
      id: string;
      name: string;
      description: string;
      type: "PAINT";
      paints: readonly Paint[];
      key: string;
    };
  } = {};
  paintStyles.forEach((paintStyle) => {
    paintStylesJSON[paintStyle.name] = {
      id: paintStyle.id,
      name: paintStyle.name,
      description: paintStyle.description,
      type: paintStyle.type,
      paints: paintStyle.paints,
      key: paintStyle.key,
    };
  });

  tokensJSON["color-tokens"]["dark"] = paintStylesJSON;
  console.log("tokensJSON", tokensJSON);

  figma.ui.postMessage({ type: "exportJSON", content: tokensJSON });
};

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: { type: string; count: number }) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  console.log("got this from the UI", msg);
  figma.notify("Received message from UI: " + msg.type);

  if (msg.type === "export-color") {
    exportColorStyles();
    figma.notify("Exporting color styles...");
  }

  if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
