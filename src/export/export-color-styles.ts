import tokensImport from "../tokens.json";
import { TokensJSON } from "./types";

const exportColorStyles = async () => {
  // Set up the JSON object structure
  const tokensJSON: TokensJSON = {
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

  // Create an empty object to hold the paint styles
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

  // Loop through the paint styles and add them to a JSON object
  paintStyles.map((paintStyle) => {
    paintStylesJSON[paintStyle.name] = {
      id: paintStyle.id,
      name: paintStyle.name,
      description: paintStyle.description,
      type: paintStyle.type,
      paints: paintStyle.paints,
      key: paintStyle.key,
    };
  });

  // sort paint styles into respective json sections
  tokensJSON["color-tokens"][themename] = paintStylesJSON;

  // Send JSON to the UI
  figma.ui.postMessage({ type: "exportJSON", content: tokensJSON });
};

export { exportColorStyles };
