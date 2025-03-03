// Main entry point for the design token system
import { 
  colors, 
  getColorToken, 
  getColorValue, 
  colorTokensToTailwind, 
  getAllColorTokens 
} from './colors';

import typography from './typography';
import { 
  getTypographyStyle, 
  getTextStyleClasses,
  getAllTypographyStyles
} from './typography';

import { 
  borderRadius, 
  getBorderRadiusToken, 
  getBorderRadiusValue, 
  borderRadiusToTailwind,
  getAllBorderRadiusTokens 
} from './borderRadius';

import { 
  shadows, 
  getShadowToken, 
  getShadowValue, 
  shadowsToTailwind,
  getAllShadowTokens 
} from './shadows';

// Export all token definitions
export { 
  colors, 
  typography, 
  borderRadius, 
  shadows 
};

// Export token types
export * from './token-types';

// Export token getters
export { 
  getColorToken, 
  getColorValue, 
  getTypographyStyle,
  getTextStyleClasses,
  getBorderRadiusToken, 
  getBorderRadiusValue, 
  getShadowToken, 
  getShadowValue 
};

// Export token list getters
export {
  getAllColorTokens,
  getAllTypographyStyles,
  getAllBorderRadiusTokens,
  getAllShadowTokens
};

// Export Tailwind configuration utilities
export {
  colorTokensToTailwind,
  borderRadiusToTailwind,
  shadowsToTailwind
};

/**
 * Generate complete Tailwind configuration from all tokens
 */
export const generateTailwindConfig = () => {
  return {
    theme: {
      extend: {
        colors: colorTokensToTailwind(),
        borderRadius: borderRadiusToTailwind(),
        boxShadow: shadowsToTailwind(),
        // Typography would need a more complex transformation
        // that we handle separately
      }
    },
    safelist: generateSafelist()
  };
};

/**
 * Generate a safelist of critical token classes to prevent Tailwind purging
 */
const generateSafelist = () => {
  const result: string[] = [];
  
  // Add color classes with different prefixes
  const colorNames = Object.keys(colorTokensToTailwind());
  colorNames.forEach(color => {
    result.push(`bg-${color}`);
    result.push(`text-${color}`);
    result.push(`border-${color}`);
  });
  
  // Add border radius classes
  const radiusNames = Object.keys(borderRadiusToTailwind());
  radiusNames.forEach(radius => {
    result.push(`rounded-${radius}`);
  });
  
  // Add shadow classes
  const shadowNames = Object.keys(shadowsToTailwind());
  shadowNames.forEach(shadow => {
    result.push(`shadow-${shadow}`);
  });
  
  return result;
};

/**
 * Generate CSS variables from all tokens
 * This can be used for non-Tailwind applications or
 * to provide fallbacks
 */
export const generateCssVariables = () => {
  let css = `:root {\n`;
  
  // Add color variables
  getAllColorTokens().forEach(token => {
    css += `  --color-${token.name}: ${token.value};\n`;
  });
  
  // Add border radius variables
  getAllBorderRadiusTokens().forEach(token => {
    css += `  --radius-${token.name.replace('radius-', '')}: ${token.value};\n`;
  });
  
  // Add shadow variables
  getAllShadowTokens().forEach(token => {
    css += `  --shadow-${token.name.replace('shadow-', '')}: ${token.value};\n`;
  });
  
  // Close root selector
  css += `}\n`;
  
  return css;
};

export default {
  colors,
  typography,
  borderRadius,
  shadows,
  generateTailwindConfig,
  generateCssVariables
};
