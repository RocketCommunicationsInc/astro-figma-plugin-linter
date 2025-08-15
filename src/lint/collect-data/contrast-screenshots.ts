import { ContrastScreenshot } from "../../types/contrast-screenshot";

const contrastScreenshots: Map<string, string[]> = new Map();

const clearContrastScreenshots = () => {
  contrastScreenshots.clear();
};

const addContrastScreenshot = (
  contrastScreenshot: ContrastScreenshot,
) => {
  contrastScreenshots.set(
    contrastScreenshot.id,
    contrastScreenshot.bytes);
};

const getContrastScreenshot = (id: string) => {
  const contrastScreenshot = contrastScreenshots.get(id);
  return contrastScreenshot;
};

export { clearContrastScreenshots, addContrastScreenshot, getContrastScreenshot };
