// Token to Tailwind configuration converter
import { colorTokensToTailwind } from './colors';
import { borderRadiusToTailwind } from './borderRadius';
import { shadowsToTailwind } from './shadows';
import { getAllTypographyStyles } from './typography';

/**
 * Generate complete Tailwind configuration from tokens
 * This is used in tailwind.config.js
 */
export const generateTailwindConfig = () => {
  // Colors
  const colors = colorTokensToTailwind();
  
  // Border Radius
  const borderRadius = borderRadiusToTailwind();
  
  // Shadows
  const boxShadow = shadowsToTailwind();
  
  // Typography - Font Sizes
  const fontSize: Record<string, any> = {};
  getAllTypographyStyles().forEach(style => {
    const key = style.name.replace('text-', '');
    fontSize[key] = [
      style.size.value,
      {
        lineHeight: style.lineHeight?.value,
        fontWeight: style.weight.value
      }
    ];
  });
  
  // Generate safelist for critical dynamic classes
  const generateSafelist = () => {
    const result: string[] = [];
    
    // Add color classes with different prefixes
    Object.keys(colors).forEach(color => {
      result.push(`bg-${color}`);
      result.push(`text-${color}`);
      result.push(`border-${color}`);
    });
    
    // Add border radius classes
    Object.keys(borderRadius).forEach(radius => {
      result.push(`rounded-${radius}`);
    });
    
    // Add shadow classes
    Object.keys(boxShadow).forEach(shadow => {
      result.push(`shadow-${shadow}`);
    });
    
    return result;
  };
  
  return {
    theme: {
      extend: {
        colors,
        borderRadius,
        boxShadow,
        fontSize
      }
    },
    safelist: generateSafelist()
  };
};

/**
 * Format for direct inclusion in tailwind.config.js
 */
export const getTailwindConfig = () => {
  const config = generateTailwindConfig();
  return JSON.stringify(config, null, 2);
};

export default generateTailwindConfig;
