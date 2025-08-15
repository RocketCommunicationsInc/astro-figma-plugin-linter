import { addContrastScreenshot } from "../collect-data/contrast-screenshots";

const collectContrastScreenshots = async (node: TextNode): Promise<boolean> => {
  if (node.type !== "TEXT") {
    return false;
  }

  // make the text fully transparent to only get the background
  const origOpacity = node.opacity;
  node.opacity = 0.001;
  const bytes = await node.exportAsync({
    format: "PNG",
    constraint: { type: "SCALE", value: 4 },
    contentsOnly: false,
  });
  
  // restore opacity
  node.opacity = origOpacity;

  addContrastScreenshot({ id: node.id, bytes });

  return true;
};

export { collectContrastScreenshots };
