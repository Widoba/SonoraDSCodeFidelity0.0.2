import {
  getColorToken,
  getBorderRadiusToken,
  getShadowToken,
  getTypographyStyle,
  getTextStyleClasses
} from '@tokens/token-index';

/**
 * TokenTransformer utility for converting between design and code token formats
 */
export class TokenTransformer {
  /**
   * Transforms a color value into corresponding token
   * @param colorValue Hex color value (e.g., "#25C9D0")
   * @returns The closest matching token or null if not found
   */
  static findColorByValue(colorValue: string) {
    // Convert to lowercase for consistent comparison
    const normalizedValue = colorValue.toLowerCase();
    
    // Get all color tokens and find the closest match
    const { getAllColorTokens } = require('@tokens/token-index');
    const allColors = getAllColorTokens();
    
    // Find exact match
    const exactMatch = allColors.find(token => token.value.toLowerCase() === normalizedValue);
    if (exactMatch) return exactMatch;
    
    // No match found
    return null;
  }

  /**
   * Transforms CSS code by replacing hardcoded values with token references
   * @param cssCode CSS code with hardcoded values
   * @returns Transformed CSS with token references
   */
  static transformCss(cssCode: string): string {
    let result = cssCode;
    
    // Replace color hex values with CSS variables
    result = this.replaceColorHexWithVars(result);
    
    // Replace border radius values with CSS variables
    result = this.replaceBorderRadiusWithVars(result);
    
    // Replace shadow values with CSS variables
    result = this.replaceShadowsWithVars(result);
    
    return result;
  }

  /**
   * Replaces color hex values with CSS variables
   */
  private static replaceColorHexWithVars(code: string): string {
    // Regex to match hex colors in different formats
    const hexRegex = /#([0-9A-Fa-f]{3}){1,2}\b/g;
    
    return code.replace(hexRegex, (match) => {
      const token = this.findColorByValue(match);
      if (token) {
        return `var(--color-${token.name})`;
      }
      return match;
    });
  }

  /**
   * Replaces border radius values with CSS variables
   */
  private static replaceBorderRadiusWithVars(code: string): string {
    // Regex for border-radius property
    const borderRadiusRegex = /border-radius:\s*(\d+)px/g;
    
    return code.replace(borderRadiusRegex, (match, pxValue) => {
      // Get all border radius tokens
      const { getAllBorderRadiusTokens } = require('@tokens/token-index');
      const allRadii = getAllBorderRadiusTokens();
      
      // Find matching token by value
      const token = allRadii.find(t => t.value === `${pxValue}px`);
      if (token) {
        return `border-radius: var(--radius-${token.name.replace('radius-', '')})`;
      }
      
      return match;
    });
  }

  /**
   * Replaces shadow values with CSS variables
   */
  private static replaceShadowsWithVars(code: string): string {
    // Regex for box-shadow property (simplified version)
    const shadowRegex = /box-shadow:\s*([^;]+)/g;
    
    return code.replace(shadowRegex, (match, shadowValue) => {
      // Get all shadow tokens
      const { getAllShadowTokens } = require('@tokens/token-index');
      const allShadows = getAllShadowTokens();
      
      // Find matching token by value
      const token = allShadows.find(t => {
        // Need to normalize the shadow value for comparison
        const normalizedValue = shadowValue.replace(/\s+/g, ' ').trim();
        const normalizedToken = t.cssValue.replace(/\s+/g, ' ').trim();
        return normalizedValue === normalizedToken;
      });
      
      if (token) {
        return `box-shadow: var(--shadow-${token.name.replace('shadow-', '')})`;
      }
      
      return match;
    });
  }

  /**
   * Transforms Tailwind code by replacing utility classes with token-based ones
   * @param tailwindCode HTML/JSX code with Tailwind utilities
   * @returns Transformed code with token-based utilities
   */
  static transformTailwind(tailwindCode: string): string {
    let result = tailwindCode;
    
    // Replace color utilities
    result = this.replaceColorUtilities(result);
    
    // Replace border radius utilities
    result = this.replaceBorderRadiusUtilities(result);
    
    // Replace shadow utilities
    result = this.replaceShadowUtilities(result);
    
    return result;
  }

  /**
   * Replaces color utilities with token-based ones
   */
  private static replaceColorUtilities(code: string): string {
    // Match bg/text/border color utilities with hex values
    const colorUtilityRegex = /(bg|text|border)-\[#([0-9A-Fa-f]{3,6})\]/g;
    
    return code.replace(colorUtilityRegex, (match, prefix, hexCode) => {
      const fullHex = hexCode.length === 3 
        ? `#${hexCode[0]}${hexCode[0]}${hexCode[1]}${hexCode[1]}${hexCode[2]}${hexCode[2]}`
        : `#${hexCode}`;
      
      const token = this.findColorByValue(fullHex);
      if (token) {
        return `${prefix}-${token.name}`;
      }
      
      return match;
    });
  }

  /**
   * Replaces border radius utilities with token-based ones
   */
  private static replaceBorderRadiusUtilities(code: string): string {
    // Match rounded utilities with px values
    const radiusUtilityRegex = /rounded-\[(\d+)px\]/g;
    
    return code.replace(radiusUtilityRegex, (match, pxValue) => {
      // Get all border radius tokens
      const { getAllBorderRadiusTokens } = require('@tokens/token-index');
      const allRadii = getAllBorderRadiusTokens();
      
      // Find matching token by value
      const token = allRadii.find(t => t.value === `${pxValue}px`);
      if (token) {
        return `rounded-${token.name.replace('radius-', '')}`;
      }
      
      return match;
    });
  }

  /**
   * Replaces shadow utilities with token-based ones
   */
  private static replaceShadowUtilities(code: string): string {
    // Match shadow utilities with arbitrary values
    const shadowUtilityRegex = /shadow-\[(.*?)\]/g;
    
    return code.replace(shadowUtilityRegex, (match, shadowValue) => {
      // Get all shadow tokens
      const { getAllShadowTokens } = require('@tokens/token-index');
      const allShadows = getAllShadowTokens();
      
      // Find matching token by value
      const token = allShadows.find(t => {
        // Need to normalize the shadow value for comparison
        const normalizedValue = shadowValue.replace(/\s+/g, ' ').trim();
        const normalizedToken = t.cssValue.replace(/\s+/g, ' ').trim();
        return normalizedValue === normalizedToken;
      });
      
      if (token) {
        return `shadow-${token.name.replace('shadow-', '')}`;
      }
      
      return match;
    });
  }

  /**
   * Converts Figma name to code token reference
   * @param figmaName Figma token name (e.g., "Olivia Blue")
   * @param type Token type
   * @returns Code reference to the token
   */
  static figmaNameToCode(figmaName: string, type: 'color' | 'borderRadius' | 'shadow' | 'typography'): string {
    switch (type) {
      case 'color': {
        const token = getColorToken(figmaName);
        return token ? token.name : '';
      }
      case 'borderRadius': {
        const token = getBorderRadiusToken(figmaName);
        return token ? `rounded-${token.name.replace('radius-', '')}` : '';
      }
      case 'shadow': {
        const token = getShadowToken(figmaName);
        return token ? `shadow-${token.name.replace('shadow-', '')}` : '';
      }
      case 'typography': {
        return getTextStyleClasses(figmaName);
      }
      default:
        return '';
    }
  }
}

export default TokenTransformer;