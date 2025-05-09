import { TokensJSON } from '../types';
import tokensJson from './tokens.json';

const stripToLoadableId: (input: string) => string | undefined = (
  input: string
) => input.match(/:(.*?),/)?.[1];

const tokens = () => {
  const tokens = tokensJson as TokensJSON;
  const colors = tokens['color-tokens'];
  const type = tokens['type-tokens'];
  const components = tokens['components'];

  const colorTokens = new Map();
  const typeTokens = new Map();
  const astroComponents = new Map();
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
  Object.entries(type).forEach(([key, value]) => {
    const styleKey = (value as { key: string })['key'];
    typeTokens.set(key, value);
    typeTokens.set(styleKey, value);
  });
  Object.entries(components).forEach(([key, value]) => {
    const componentKey = (value as { key: string })['key'];
    astroComponents.set(key, value);
    astroComponents.set(componentKey, value);
  });

  return {
    colorTokens,
    typeTokens,
    astroComponents
  };
}

export { tokens, stripToLoadableId };

