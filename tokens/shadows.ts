// Shadow Tokens
import { ShadowTokens, ShadowToken } from './token-types';

export const shadows: ShadowTokens = {
  outerDark9: {
    value: '0px 3px 9px 0px rgba(0, 0, 0, 0.50)',
    name: 'shadow-outer-dark',
    figmaName: 'Outer Dark 9 Blur',
    cssValue: 'box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.50)'
  },
  outerMedium16: {
    value: '0px 4px 16px 0px rgba(0, 0, 0, 0.28)',
    name: 'shadow-outer-medium-16',
    figmaName: 'Outer Medium 16 Blur',
    cssValue: 'box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.28)'
  },
  outerMedium12: {
    value: '0px 6px 12px 0px rgba(0, 0, 0, 0.18)',
    name: 'shadow-outer-medium-12',
    figmaName: 'Outer Medium 12 Blur',
    cssValue: 'box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.18)'
  },
  outerTooltip: {
    value: '0px 2px 8px 0px rgba(0, 0, 0, 0.20)',
    name: 'shadow-tooltip',
    figmaName: 'Outer Tooltip',
    cssValue: 'box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.20)'
  },
  outerLight10: {
    value: '0px 2px 10px 2px rgba(0, 0, 0, 0.10)',
    name: 'shadow-outer-light',
    figmaName: 'Outer Light 10 Blur',
    cssValue: 'box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.10)'
  },
  outerExtraLight3: {
    value: '0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
    name: 'shadow-outer-extra-light',
    figmaName: 'Outer Extra Light 3 Blur',
    cssValue: 'box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.10)'
  },
  boxShadowInner: {
    value: '0px 1px 2px 0px rgba(0, 0, 0, 0.20) inset',
    name: 'shadow-inner',
    figmaName: 'Box Shadow Inner',
    cssValue: 'box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.20) inset'
  }
};

/**
 * Get all shadow tokens as a flat array
 */
export const getAllShadowTokens = (): ShadowToken[] => {
  return Object.values(shadows);
};

/**
 * Get a shadow token by its Figma name
 */
export const getShadowByFigmaName = (figmaName: string): ShadowToken | undefined => {
  for (const key in shadows) {
    if (shadows[key].figmaName === figmaName) {
      return shadows[key];
    }
  }
  return undefined;
};

/**
 * Get a shadow token by its semantic name
 */
export const getShadowByName = (name: string): ShadowToken | undefined => {
  for (const key in shadows) {
    if (shadows[key].name === name) {
      return shadows[key];
    }
  }
  return undefined;
};

/**
 * Get a shadow token by either name or Figma name
 */
export const getShadowToken = (nameOrFigmaName: string): ShadowToken | undefined => {
  return getShadowByName(nameOrFigmaName) || getShadowByFigmaName(nameOrFigmaName);
};

/**
 * Get a shadow value
 */
export const getShadowValue = (nameOrFigmaName: string): string => {
  const token = getShadowToken(nameOrFigmaName);
  
  if (!token) {
    throw new Error(`Shadow "${nameOrFigmaName}" not found`);
  }
  
  return token.value;
};

/**
 * Convert shadow tokens to Tailwind config format
 */
export const shadowsToTailwind = () => {
  const result: Record<string, string> = {};
  
  getAllShadowTokens().forEach(token => {
    result[token.name.replace('shadow-', '')] = token.value;
  });
  
  return result;
};

export default shadows;
