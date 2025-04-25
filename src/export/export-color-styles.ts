const exportColorStyles = async () => {
  // Get all local paint styles
  const paintStyles = await figma.getLocalPaintStylesAsync().then(
    (paintStyles) => paintStyles,
    (error) => {
      console.error("Error fetching local paint styles:", error);
      return [];
    }
  );

  // Set up the JSON object structure
  const tokensJSON = {
    "color-tokens": {
      [ "dark" ]: {},
      [ "light" ]: {},
    },
  };

  // Loop through the paint styles and add them to a JSON object
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
  // Send JSON to the UI
  figma.ui.postMessage({ type: "exportJSON", content: tokensJSON });
};

export { exportColorStyles}
