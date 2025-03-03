import { getColorToken, getColorValue } from '../tokens/colors';
import { getBorderRadiusToken, getBorderRadiusValue } from '../tokens/borderRadius';
import { getShadowToken, getShadowValue } from '../tokens/shadows';
import { getTextStyleClasses, getTypographyStyle } from '../tokens/typography';

/**
 * Hook for accessing design tokens in components
 */
export const useTokens = () => {
  /**
   * Get a color class for background, text, or border
   * @param nameOrFigmaName The token name or Figma name (e.g., "Olivia Blue" or "olivia-blue")
   * @param type The type of CSS property (bg, text, border)
   * @returns Tailwind class (e.g., "bg-olivia-blue")
   */
  const getColor = (nameOrFigmaName: string, type: 'bg' | 'text' | 'border' = 'bg'): string => {
    try {
      const token = getColorToken(nameOrFigmaName);
      if (!token) return '';
      return `${type}-${token.name}`;
    } catch (error) {
      console.error(`Error getting color: ${error}`);
      return '';
    }
  };
  
  /**
   * Get a color's hex value
   * @param nameOrFigmaName The token name or Figma name
   * @returns Hex color value (e.g., "#25C9D0")
   */
  const getColorHex = (nameOrFigmaName: string): string => {
    try {
      return getColorValue(nameOrFigmaName);
    } catch (error) {
      console.error(`Error getting color hex: ${error}`);
      return '';
    }
  };
  
  /**
   * Get a border radius class
   * @param nameOrFigmaName The token name or Figma name (e.g., "3x Small" or "radius-3xs")
   * @returns Tailwind class (e.g., "rounded-3xs")
   */
  const getBorderRadius = (nameOrFigmaName: string): string => {
    try {
      const token = getBorderRadiusToken(nameOrFigmaName);
      if (!token) return '';
      return `rounded-${token.name.replace('radius-', '')}`;
    } catch (error) {
      console.error(`Error getting border radius: ${error}`);
      return '';
    }
  };
  
  /**
   * Get a shadow class
   * @param nameOrFigmaName The token name or Figma name (e.g., "Outer Dark 9 Blur" or "shadow-outer-dark")
   * @returns Tailwind class (e.g., "shadow-outer-dark")
   */
  const getShadow = (nameOrFigmaName: string): string => {
    try {
      const token = getShadowToken(nameOrFigmaName);
      if (!token) return '';
      return token.name;
    } catch (error) {
      console.error(`Error getting shadow: ${error}`);
      return '';
    }
  };
  
  /**
   * Get typography classes
   * @param nameOrFigmaName The token name or Figma name (e.g., "Header 1" or "text-headline-h1")
   * @returns Tailwind classes (e.g., "text-xl font-semibold leading-7")
   */
  const getTypography = (nameOrFigmaName: string): string => {
    try {
      return getTextStyleClasses(nameOrFigmaName);
    } catch (error) {
      console.error(`Error getting typography: ${error}`);
      return '';
    }
  };
  
  /**
   * Get a design token by Figma name (for GUI tools)
   * @param type The token type
   * @param figmaName The Figma name of the token
   * @returns The token value and classes
   */
  const getTokenByFigmaName = (
    type: 'color' | 'borderRadius' | 'shadow' | 'typography',
    figmaName: string
  ) => {
    switch (type) {
      case 'color':
        return getColorToken(figmaName);
      case 'borderRadius':
        return getBorderRadiusToken(figmaName);
      case 'shadow':
        return getShadowToken(figmaName);
      case 'typography':
        return getTypographyStyle(figmaName);
      default:
        return null;
    }
  };
  
  return {
    getColor,
    getColorHex,
    getBorderRadius,
    getShadow,
    getTypography,
    getTokenByFigmaName
  };
};

export default useTokens;
