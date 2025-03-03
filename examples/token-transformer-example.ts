import { getAllColorTokens } from '../tokens/colors';
import { getAllBorderRadiusTokens } from '../tokens/borderRadius';
import { getAllShadowTokens } from '../tokens/shadows';

/**
 * Transform hardcoded values in exported code to use token references
 */
export const transformCode = (code: string): string => {
  let transformedCode = code;
  
  // Get all tokens
  const colorTokens = getAllColorTokens();
  const borderRadiusTokens = getAllBorderRadiusTokens();
  const shadowTokens = getAllShadowTokens();
  
  // Transform color values (both CSS and inline style formats)
  colorTokens.forEach(token => {
    // Transform background colors (CSS and inline)
    transformedCode = transformedCode
      // CSS with background-color
      .replace(new RegExp(`background-color:\\s*${escapeRegExp(token.value)}`, 'gi'), 
        `background-color: var(--color-${token.name})`)
      // CSS with background shorthand
      .replace(new RegExp(`background:\\s*${escapeRegExp(token.value)}`, 'gi'), 
        `background: var(--color-${token.name})`)
      // React inline style with backgroundColor
      .replace(new RegExp(`backgroundColor:\\s*['"]${escapeRegExp(token.value)}['"]`, 'gi'), 
        `backgroundColor: "{getColor('${token.figmaName}')}"`)
      // React inline style with background
      .replace(new RegExp(`background:\\s*['"]${escapeRegExp(token.value)}['"]`, 'gi'), 
        `background: "{getColor('${token.figmaName}')}"`)
      // className with inline hex
      .replace(new RegExp(`className="([^"]*)bg-\\[${escapeRegExp(token.value)}\\]([^"]*)"`, 'gi'), 
        `className="$1{getColor('${token.figmaName}')}$2"`);
    
    // Transform text colors
    transformedCode = transformedCode
      // CSS with color
      .replace(new RegExp(`color:\\s*${escapeRegExp(token.value)}`, 'gi'), 
        `color: var(--color-${token.name})`)
      // React inline style with color
      .replace(new RegExp(`color:\\s*['"]${escapeRegExp(token.value)}['"]`, 'gi'), 
        `color: "{getColor('${token.figmaName}', 'text')}"`)
      // className with inline hex
      .replace(new RegExp(`className="([^"]*)text-\\[${escapeRegExp(token.value)}\\]([^"]*)"`, 'gi'), 
        `className="$1{getColor('${token.figmaName}', 'text')}$2"`);
    
    // Transform border colors
    transformedCode = transformedCode
      // CSS with border-color
      .replace(new RegExp(`border-color:\\s*${escapeRegExp(token.value)}`, 'gi'), 
        `border-color: var(--color-${token.name})`)
      // CSS with border shorthand (this is simplistic, could be improved)
      .replace(new RegExp(`border:\\s*([^;]*?)${escapeRegExp(token.value)}`, 'gi'), 
        `border: $1var(--color-${token.name})`)
      // React inline style with borderColor
      .replace(new RegExp(`borderColor:\\s*['"]${escapeRegExp(token.value)}['"]`, 'gi'), 
        `borderColor: "{getColor('${token.figmaName}', 'border')}"`)
      // className with inline hex
      .replace(new RegExp(`className="([^"]*)border-\\[${escapeRegExp(token.value)}\\]([^"]*)"`, 'gi'), 
        `className="$1{getColor('${token.figmaName}', 'border')}$2"`);
  });
  
  // Transform border radius values
  borderRadiusTokens.forEach(token => {
    transformedCode = transformedCode
      // CSS with border-radius
      .replace(new RegExp(`border-radius:\\s*${escapeRegExp(token.value)}`, 'gi'), 
        `border-radius: var(--radius-${token.name.replace('radius-', '')})`)
      // React inline style with borderRadius
      .replace(new RegExp(`borderRadius:\\s*['"]${escapeRegExp(token.value)}['"]`, 'gi'), 
        `borderRadius: "{getBorderRadius('${token.figmaName}')}"`)
      // className with inline border radius
      .replace(new RegExp(`className="([^"]*)rounded-\\[${escapeRegExp(token.value)}\\]([^"]*)"`, 'gi'), 
        `className="$1{getBorderRadius('${token.figmaName}')}$2"`);
  });
  
  // Transform shadow values
  shadowTokens.forEach(token => {
    transformedCode = transformedCode
      // CSS with box-shadow
      .replace(new RegExp(`box-shadow:\\s*${escapeRegExp(token.value)}`, 'gi'), 
        `box-shadow: var(--shadow-${token.name.replace('shadow-', '')})`)
      // React inline style with boxShadow
      .replace(new RegExp(`boxShadow:\\s*['"]${escapeRegExp(token.value)}['"]`, 'gi'), 
        `boxShadow: "{getShadow('${token.figmaName}')}"`)
      // className with inline shadow
      .replace(new RegExp(`className="([^"]*)shadow-\\[${escapeRegExp(token.value)}\\]([^"]*)"`, 'gi'), 
        `className="$1{getShadow('${token.figmaName}')}$2"`);
  });
  
  // Add necessary import for the useTokens hook if it's not already there
  if (!transformedCode.includes('useTokens')) {
    // Find the import section
    const importMatch = transformedCode.match(/import\s+.*?from\s+['"].*?['"]/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      const importIndex = transformedCode.indexOf(lastImport) + lastImport.length;
      
      transformedCode = 
        transformedCode.substring(0, importIndex) + 
        `\nimport { useTokens } from '../hooks/useTokens';` + 
        transformedCode.substring(importIndex);
    }
    
    // Add the hook to the component
    transformedCode = transformedCode.replace(
      /function\s+(\w+).*?\{/,
      function(match) {
        return match + `\n  const { getColor, getBorderRadius, getShadow, getTypography } = useTokens();`;
      }
    );
  }
  
  return transformedCode;
};

/**
 * Escape special characters in a string for use in a regular expression
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default transformCode;
