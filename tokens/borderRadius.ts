// Border Radius Tokens
import { BorderRadiusTokens, BorderRadiusToken } from './types';

export const borderRadius: BorderRadiusTokens = {
  '3xSmall': {
    value: '2px',
    name: 'radius-3xs',
    figmaName: '3x Small',
    cssValue: 'border-radius: 2px'
  },
  '2xSmall': {
    value: '4px',
    name: 'radius-2xs',
    figmaName: '2x Small',
    cssValue: 'border-radius: 4px'
  },
  '1xSmall': {
    value: '8px',
    name: 'radius-xs',
    figmaName: '1x Small',
    cssValue: 'border-radius: 8px'
  },
  'small': {
    value: '12px',
    name: 'radius-sm',
    figmaName: 'Small',
    cssValue: 'border-radius: 12px'
  },
  'medium': {
    value: '16px',
    name: 'radius-md',
    figmaName: 'Medium',
    cssValue: 'border-radius: 16px'
  }
};

/**
 * Get all border radius tokens as a flat array
 */
export const getAllBorderRadiusTokens = (): BorderRadiusToken[] => {
  return Object.values(borderRadius);
};

/**
 * Get a border radius token by its Figma name
 */
export const getBorderRadiusByFigmaName = (figmaName: string): BorderRadiusToken | undefined => {
  for (const key in borderRadius) {
    if (borderRadius[key].figmaName === figmaName) {
      return borderRadius[key];
    }
  }
  return undefined;
};

/**
 * Get a border radius token by its semantic name
 */
export const getBorderRadiusByName = (name: string): BorderRadiusToken | undefined => {
  for (const key in borderRadius) {
    if (borderRadius[key].name === name) {
      return borderRadius[key];
    }
  }
  return undefined;
};

/**
 * Get a border radius token by either name or Figma name
 */
export const getBorderRadiusToken = (nameOrFigmaName: string): BorderRadiusToken | undefined => {
  return getBorderRadiusByName(nameOrFigmaName) || getBorderRadiusByFigmaName(nameOrFigmaName);
};

/**
 * Get a border radius value
 */
export const getBorderRadiusValue = (nameOrFigmaName: string): string => {
  const token = getBorderRadiusToken(nameOrFigmaName);
  
  if (!token) {
    throw new Error(`Border radius "${nameOrFigmaName}" not found`);
  }
  
  return token.value;
};

/**
 * Convert border radius tokens to Tailwind config format
 */
export const borderRadiusToTailwind = () => {
  const result: Record<string, string> = {};
  
  getAllBorderRadiusTokens().forEach(token => {
    result[token.name.replace('radius-', '')] = token.value;
  });
  
  return result;
};

export default borderRadius;
