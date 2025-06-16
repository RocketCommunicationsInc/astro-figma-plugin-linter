// We need to convert them to 0-255 for css.
// Figma stores rgb values in a 0-1 range.
function convertFigmaPaintToCSS(paint: Paint) {
  if (paint.type === 'SOLID') {
    const rgbInput = paint.color;
    const r = Math.round(255 * rgbInput.r);
    const g = Math.round(255 * rgbInput.g);
    const b = Math.round(255 * rgbInput.b);
    return `rgba(${r},${g},${b},${paint.opacity ?? 1})`;
  }
  // Fallback for non-solid paints
  return 'transparent';
}

interface FigmaRGB {
  r: number;
  g: number;
  b: number;
}

function convertFigmaColorToCSS(color: FigmaRGB, opacity: number): string {
  const r = Math.round(255 * color.r)
  const g = Math.round(255 * color.g)
  const b = Math.round(255 * color.b)
  return `rgba(${r},${g},${b},${opacity})`
}

export { convertFigmaPaintToCSS, convertFigmaColorToCSS };
