import { TokensJSON } from '../types/tokens';
import tokensJson from './tokens.json';

const stripToLoadableId: (input: string) => string | undefined = (
  input: string
) => input.match(/:(.*?),/)?.[1];

const tokens = () => {
  const tokens = tokensJson as unknown as TokensJSON;
  const colors = tokens['color-tokens'];
  const type = tokens['type-tokens'];
  const components = tokens['components'];
  const icons = tokens['icons'];

  const colorTokens = new Map();
  const typeTokens = new Map();
  const astroComponents = new Map();
  const astroIcons = new Map();

  Object.entries(colors.dark).forEach(([key, value]) => {
    const nameWithTheme = 'dark/' + key;
    const styleKey = (value as { key: string })['key'];
    colorTokens.set(nameWithTheme, value);
    colorTokens.set(styleKey, value);
  });
  Object.entries(colors.light).forEach(([key, value]) => {
    const nameWithTheme = 'light/' + key;
    const styleKey = (value as { key: string })['key'];
    colorTokens.set(nameWithTheme, value);
    colorTokens.set(styleKey, value);
  });
  Object.entries(colors.wireframe).forEach(([key, value]) => {
    const nameWithTheme = 'wireframe/' + key;
    const styleKey = (value as { key: string })['key'];
    colorTokens.set(nameWithTheme, value);
    colorTokens.set(styleKey, value);
  });

  Object.entries(type.dark).forEach(([key, value]) => {
    const nameWithTheme = 'dark/' + key;
    const styleKey = (value as { key: string })['key'];
    typeTokens.set(nameWithTheme, value);
    typeTokens.set(styleKey, value);
  });
  Object.entries(type.light).forEach(([key, value]) => {
    const nameWithTheme = 'light/' + key;
    const styleKey = (value as { key: string })['key'];
    typeTokens.set(nameWithTheme, value);
    typeTokens.set(styleKey, value);
  });
  Object.entries(type.wireframe).forEach(([key, value]) => {
    const nameWithTheme = 'wireframe/' + key;
    const styleKey = (value as { key: string })['key'];
    typeTokens.set(nameWithTheme, value);
    typeTokens.set(styleKey, value);
  });

  Object.entries(components).forEach(([key, value]) => {
    const componentKey = (value as { key: string })['key'];
    astroComponents.set(key, value);
    astroComponents.set(componentKey, value);
  });

  Object.entries(icons).forEach(([key, value]) => {
    const iconKey = (value as { key: string })['key'];
    astroIcons.set(key, value);
    astroIcons.set(iconKey, value);
  });

  return {
    colorTokens,
    typeTokens,
    astroComponents,
    astroIcons,
  };
}

export { tokens, stripToLoadableId };

