import tokensImport from "../tokens.json";
import { TokensJSON } from "./types";

const exportTypeStyles = async () => {
  // Set up the JSON object structure
  const tokensJSON: TokensJSON = {
    ...tokensImport,
    "type-tokens": tokensImport["type-tokens"],
  };

  // Get all local type styles
  const typeStyles = await figma.getLocalTextStylesAsync().then(
    (typeStyles) => typeStyles,
    (error) => {
      console.error("Error fetching local text styles:", error);
      return [];
    }
  );

  // Create an empty object to hold the type styles
  const typeStylesJSON: {
    [key: string]: {
      id: string;
      name: string;
      description: string | null;
      type: string;
      key: string;
      fontName: { family: string; style: string };
      fontSize: number;
      leadingTrim: string;
      letterSpacing: { value: number; unit: string };
      lineHeight: { value: number | string; unit: string };
      listSpacing: number;
      paragraphIndent: number;
      paragraphSpacing: number;
      textCase: string;
      textDecoration: string;
    };
  } = {};

  // Loop through the type styles and add them to a JSON object
  typeStyles.map((typeStyle) => {
    typeStylesJSON[typeStyle.name] = {
      id: typeStyle.id,
      name: typeStyle.name,
      description: typeStyle.description,
      type: typeStyle.type,
      key: typeStyle.key,
      fontName: typeStyle.fontName,
      fontSize: typeStyle.fontSize,
      leadingTrim: typeStyle.leadingTrim,
      letterSpacing: typeStyle.letterSpacing,
      lineHeight:
        "value" in typeStyle.lineHeight
          ? typeStyle.lineHeight
          : { value: "AUTO", unit: typeStyle.lineHeight.unit },
      listSpacing: typeStyle.listSpacing,
      paragraphIndent: typeStyle.paragraphIndent,
      paragraphSpacing: typeStyle.paragraphSpacing,
      textCase: typeStyle.textCase,
      textDecoration: typeStyle.textDecoration,
    };
  });

  // sort type styles into respective json sections
  tokensJSON["type-tokens"] = typeStylesJSON;

  // Send JSON to the UI
  figma.ui.postMessage({ type: "exportJSON", content: tokensJSON });
};

export { exportTypeStyles };
