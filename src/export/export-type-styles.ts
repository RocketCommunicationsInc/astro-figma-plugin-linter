import tokensImport from "../tokens.json";

const exportTypeStyles = async () => {
  // Set up the JSON object structure
  const tokensJSON = {
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

  // Loop through the paint styles and add them to a JSON object
  const typeStylesJSON = {};

  typeStyles.forEach((typeStyle) => {
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
      lineHeight: typeStyle.lineHeight,
      listSpacing: typeStyle.listSpacing,
      paragraphIndent: typeStyle.paragraphIndent,
      paragraphSpacing: typeStyle.paragraphSpacing,
      textCase: typeStyle.textCase,
      textDecoration: typeStyle.textDecoration,
      textDecorationColor: typeStyle.textDecorationColor,
      textDecorationOffset: typeStyle.textDecorationOffset,
      textDecorationSkipLink: typeStyle.textDecorationSkipLink,
      textDecorationStyle: typeStyle.textDecorationStyle,
      textDecorationThickness: typeStyle.textDecorationThickness,
    };
  });

  tokensJSON["type-tokens"] = typeStylesJSON;
  // Send JSON to the UI
  figma.ui.postMessage({ type: "exportJSON", content: tokensJSON });
};

export { exportTypeStyles };
