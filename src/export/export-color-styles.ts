import tokensImport from "../tokens.json";

const exportColorStyles = async () => {
  // Set up the JSON object structure
  const tokensJSON: {
    "color-tokens": {
      dark: Record<string, unknown>;
      light: Record<string, unknown>;
    };
  } = {
    ...tokensImport,
    "color-tokens": {
      dark: tokensImport["color-tokens"]["dark"],
      light: tokensImport["color-tokens"]["light"],
    },
  };

  // sort color themes into respective json sections
  const figmaFileName = figma.root.name;
  const themename = figmaFileName.includes("light") ? "light" : "dark";

  // Get all local paint styles
  const paintStyles = await figma.getLocalPaintStylesAsync().then(
    (paintStyles) => paintStyles,
    (error) => {
      console.error("Error fetching local paint styles:", error);
      return [];
    }
  );

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

  tokensJSON["color-tokens"][themename] = paintStylesJSON;
  // Send JSON to the UI
  figma.ui.postMessage({ type: "exportJSON", content: tokensJSON });
};

export { exportColorStyles };
