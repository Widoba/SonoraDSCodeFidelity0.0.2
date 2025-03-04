/**
 * Component Transformer module for Lovable Component Transformer
 * 
 * This module transforms components to use design tokens
 */

import { ComponentFile } from '../repository-access/types';
import { ComponentAnalysis } from '../component-analyzer';
import { 
  getAllColorTokens,
  getAllBorderRadiusTokens,
  getAllShadowTokens,
  getAllTypographyTokens 
} from '@tokens/token-index';

/**
 * Import token matching utilities
 */
import { 
  findColorToken, 
  findBorderRadiusToken, 
  findShadowToken 
} from './token-matcher';

/**
 * Transformation result
 */
export interface TransformationResult {
  /**
   * Original component files
   */
  originalFiles: ComponentFile[];
  
  /**
   * Transformed component files
   */
  transformedFiles: ComponentFile[];
  
  /**
   * Transformation summary
   */
  summary: TransformationSummary;
}

/**
 * Transformation summary
 */
export interface TransformationSummary {
  /**
   * Number of colors transformed
   */
  colorsTransformed: number;
  
  /**
   * Number of border radii transformed
   */
  borderRadiiTransformed: number;
  
  /**
   * Number of shadows transformed
   */
  shadowsTransformed: number;
  
  /**
   * Number of Tailwind classes transformed
   */
  tailwindClassesTransformed: number;
}

/**
 * Transform design token imports in a component
 * 
 * @param content File content 
 * @param tokenImports Token imports detected in the analysis
 * @returns Transformed content and count of transformations
 */
function transformTokenImports(
  content: string, 
  tokenImports?: { source: string; tokens: string[] }[]
): { content: string; count: number } {
  if (!tokenImports || tokenImports.length === 0) {
    return { content, count: 0 };
  }
  
  let transformedContent = content;
  let count = 0;
  
  // Check for design token imports that need to be replaced
  for (const importInfo of tokenImports) {
    // Skip if not a design token import
    if (!importInfo.source.includes('design-token') && 
        !importInfo.source.includes('design-system')) {
      continue;
    }
    
    // Check which tokens are imported
    const hasColors = importInfo.tokens.includes('colors');
    const hasBorderRadius = importInfo.tokens.includes('borderRadius');
    const hasShadows = importInfo.tokens.includes('shadows');
    const hasTypography = importInfo.tokens.includes('typography');
    
    if (hasColors || hasBorderRadius || hasShadows || hasTypography) {
      // Build new import
      const newImports = [];
      if (hasColors) newImports.push('getAllColorTokens', 'getColorToken', 'getColorValue');
      if (hasBorderRadius) newImports.push('getAllBorderRadiusTokens', 'getBorderRadiusToken', 'getBorderRadiusValue');
      if (hasShadows) newImports.push('getAllShadowTokens', 'getShadowToken', 'getShadowValue');
      if (hasTypography) newImports.push('getAllTypographyStyles', 'getTypographyStyle');
      
      // Create regex to match the specific import
      const importStr = `import\\s*{\\s*${importInfo.tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s*,\\s*')}\\s*}\\s*from\\s*['"]${importInfo.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`;
      const importRegex = new RegExp(importStr);
      
      // Replace the import
      const newImport = `import { ${newImports.join(', ')} } from '@tokens/token-index';`;
      const newContent = transformedContent.replace(importRegex, newImport);
      
      if (newContent !== transformedContent) {
        transformedContent = newContent;
        count++;
      }
    }
  }
  
  // Transform token usage patterns
  if (count > 0) {
    // Replace direct token access with getter functions
    const colorAccessRegex = /colors\.([a-zA-Z0-9]+)/g;
    transformedContent = transformedContent.replace(colorAccessRegex, (match, colorName) => {
      // Convert camelCase to token format
      const tokenName = colorName
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
      
      return `getColorValue('${tokenName}')`;
    });
    
    // Transform border radius access
    const borderRadiusAccessRegex = /borderRadius\.([a-zA-Z0-9]+)/g;
    transformedContent = transformedContent.replace(borderRadiusAccessRegex, (match, radiusName) => {
      // Map to our radius system
      const radiusMap: Record<string, string> = {
        'xs3': 'sm',
        'xs2': 'base',
        'xs1': 'lg',
        'small': 'xl',
        'medium': '2xl',
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg',
        'xl': 'xl',
        '2xl': '2xl'
      };
      
      const tokenName = radiusMap[radiusName] || radiusName;
      return `getBorderRadiusValue('radius-${tokenName}')`;
    });
    
    // Transform shadow access
    const shadowAccessRegex = /shadows\.([a-zA-Z0-9]+)/g;
    transformedContent = transformedContent.replace(shadowAccessRegex, (match, shadowName) => {
      // Map to our shadow system
      const shadowMap: Record<string, string> = {
        'shadow1': 'md',
        'shadow2': 'lg',
        'shadow3': 'xl',
        'shadow4': 'md-light',
        'shadow5': '2xl',
        'shadow6': 'base',
        'shadow7': 'inner',
        'sm': 'sm',
        'md': 'md',
        'lg': 'lg',
        'xl': 'xl',
        '2xl': '2xl'
      };
      
      const tokenName = shadowMap[shadowName] || shadowName;
      return `getShadowValue('shadow-${tokenName}')`;
    });
  }
  
  return { content: transformedContent, count };
}

/**
 * Transform hex colors to use design tokens
 * 
 * @param content File content
 * @returns Transformed content and transformation count
 */
function transformColors(content: string): { content: string; count: number } {
  let transformedContent = content;
  let count = 0;
  
  // Replace hex colors with token variables
  // Match hex colors (#fff, #ffffff, etc.)
  const hexRegex = /#([0-9A-Fa-f]{3}){1,2}\b/g;
  const matches = content.match(hexRegex) || [];
  
  for (const hexColor of matches) {
    // Find matching token
    const match = findColorToken(hexColor);
    
    if (match && match.confidence > 0.8) {
      // Replace with CSS variable
      transformedContent = transformedContent.replace(
        new RegExp(hexColor, 'g'),
        `var(--color-${match.token.name})`
      );
      count++;
    }
  }
  
  return { content: transformedContent, count };
}

/**
 * Transform rgba colors to use design tokens
 * 
 * @param content File content
 * @returns Transformed content and transformation count
 */
function transformRgbaColors(content: string): { content: string; count: number } {
  let transformedContent = content;
  let count = 0;
  
  // Replace rgba colors with token variables
  const rgbaRegex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/g;
  const matches = content.match(rgbaRegex) || [];
  
  for (const rgbaColor of matches) {
    // Find matching token
    const match = findColorToken(rgbaColor);
    
    if (match && match.confidence > 0.8) {
      // Replace with CSS variable
      transformedContent = transformedContent.replace(
        new RegExp(rgbaColor.replace(/([()])/g, '\\$1'), 'g'),
        `var(--color-${match.token.name})`
      );
      count++;
    }
  }
  
  return { content: transformedContent, count };
}

/**
 * Transform border radii to use design tokens
 * 
 * @param content File content
 * @returns Transformed content and transformation count
 */
function transformBorderRadii(content: string): { content: string; count: number } {
  let transformedContent = content;
  let count = 0;
  
  // Replace border-radius CSS properties
  const cssRadiusRegex = /border-radius:\s*(\d+)px/g;
  const cssMatches = [];
  let match;
  
  // Find all matches first
  while ((match = cssRadiusRegex.exec(content)) !== null) {
    cssMatches.push({
      full: match[0],
      value: `${match[1]}px`
    });
  }
  
  // Replace each match
  for (const { full, value } of cssMatches) {
    const tokenMatch = findBorderRadiusToken(value);
    
    if (tokenMatch && tokenMatch.confidence > 0.7) {
      // Replace with CSS variable
      transformedContent = transformedContent.replace(
        full,
        `border-radius: var(--radius-${tokenMatch.token.name.replace('radius-', '')})`
      );
      count++;
    }
  }
  
  // Also transform tailwind rounded classes
  const roundedRegex = /rounded(-[a-z]+)*\b/g;
  const roundedMatches = [];
  
  // Reset match for new regex
  while ((match = roundedRegex.exec(content)) !== null) {
    if (!match[0].includes("rounded-[")) {
      roundedMatches.push({
        full: match[0],
        value: match[0]
      });
    }
  }
  
  // Replace each Tailwind match
  for (const { full, value } of roundedMatches) {
    const tokenMatch = findBorderRadiusToken(value);
    
    if (tokenMatch && tokenMatch.confidence > 0.7) {
      // Replace with token-based class if not already using one
      const tokenName = tokenMatch.token.name.replace('radius-', '');
      const newClass = `rounded-${tokenName}`;
      
      if (full !== newClass) {
        transformedContent = transformedContent.replace(
          new RegExp(`\\b${full}\\b`, 'g'),
          newClass
        );
        count++;
      }
    }
  }
  
  return { content: transformedContent, count };
}

/**
 * Transform shadows to use design tokens
 * 
 * @param content File content
 * @returns Transformed content and transformation count
 */
function transformShadows(content: string): { content: string; count: number } {
  let transformedContent = content;
  let count = 0;
  
  // Replace box-shadow CSS properties
  const cssShadowRegex = /box-shadow:\s*([^;]+)/g;
  const cssMatches = [];
  let match;
  
  // Find all matches first
  while ((match = cssShadowRegex.exec(content)) !== null) {
    cssMatches.push({
      full: match[0],
      value: match[1].trim()
    });
  }
  
  // Replace each match
  for (const { full, value } of cssMatches) {
    const tokenMatch = findShadowToken(value);
    
    if (tokenMatch && tokenMatch.confidence > 0.7) {
      // Replace with CSS variable
      transformedContent = transformedContent.replace(
        full,
        `box-shadow: var(--shadow-${tokenMatch.token.name.replace('shadow-', '')})`
      );
      count++;
    }
  }
  
  // Also transform box-shadow in style objects
  const jsBoxShadowRegex = /boxShadow:\s*["']([^"']+)["']/g;
  const jsMatches = [];
  
  // Reset match for new regex
  while ((match = jsBoxShadowRegex.exec(content)) !== null) {
    jsMatches.push({
      full: match[0],
      value: match[1].trim()
    });
  }
  
  // Replace each JavaScript style match
  for (const { full, value } of jsMatches) {
    const tokenMatch = findShadowToken(value);
    
    if (tokenMatch && tokenMatch.confidence > 0.7) {
      // Replace with token reference
      transformedContent = transformedContent.replace(
        full,
        `boxShadow: "var(--shadow-${tokenMatch.token.name.replace('shadow-', '')})"`
      );
      count++;
    }
  }
  
  // Also transform shadow classes
  const shadowClassRegex = /shadow(-[a-z0-9]+)?\b/g;
  const shadowClassMatches = [];
  
  // Reset match for new regex
  while ((match = shadowClassRegex.exec(content)) !== null) {
    if (!match[0].includes("shadow-[")) {
      shadowClassMatches.push({
        full: match[0],
        value: match[0]
      });
    }
  }
  
  // Replace each Tailwind shadow match
  for (const { full, value } of shadowClassMatches) {
    const tokenMatch = findShadowToken(value);
    
    if (tokenMatch && tokenMatch.confidence > 0.7) {
      // Replace with token-based class
      const tokenName = tokenMatch.token.name.replace('shadow-', '');
      const newClass = `shadow-${tokenName}`;
      
      if (full !== newClass) {
        transformedContent = transformedContent.replace(
          new RegExp(`\\b${full}\\b`, 'g'),
          newClass
        );
        count++;
      }
    }
  }
  
  return { content: transformedContent, count };
}

/**
 * Transform Tailwind classes to use design tokens
 * 
 * @param content File content
 * @returns Transformed content and transformation count
 */
function transformTailwindClasses(
  content: string
): { content: string; count: number } {
  let transformedContent = content;
  let count = 0;
  
  // Transform color utilities
  const colorUtilityRegex = /(bg|text|border)-\[#([0-9A-Fa-f]{3,6})\]/g;
  const colorMatches = [];
  let match;
  
  // Find all matches first
  while ((match = colorUtilityRegex.exec(content)) !== null) {
    colorMatches.push({
      full: match[0],
      prefix: match[1],
      hexCode: match[2]
    });
  }
  
  // Replace each match
  for (const { full, prefix, hexCode } of colorMatches) {
    const fullHex = hexCode.length === 3 
      ? `#${hexCode[0]}${hexCode[0]}${hexCode[1]}${hexCode[1]}${hexCode[2]}${hexCode[2]}`
      : `#${hexCode}`;
    
    const tokenMatch = findColorToken(fullHex);
    
    if (tokenMatch && tokenMatch.confidence > 0.8) {
      // Replace with token-based class
      transformedContent = transformedContent.replace(
        full,
        `${prefix}-${tokenMatch.token.name}`
      );
      count++;
    }
  }
  
  // Transform rgba color utilities
  const rgbaUtilityRegex = /(bg|text|border)-\[rgba\(([^)]+)\)\]/g;
  const rgbaMatches = [];
  
  // Find all matches first
  while ((match = rgbaUtilityRegex.exec(content)) !== null) {
    rgbaMatches.push({
      full: match[0],
      prefix: match[1],
      rgbaValue: `rgba(${match[2]})`
    });
  }
  
  // Replace each rgba match
  for (const { full, prefix, rgbaValue } of rgbaMatches) {
    const tokenMatch = findColorToken(rgbaValue);
    
    if (tokenMatch && tokenMatch.confidence > 0.8) {
      // Replace with token-based class
      transformedContent = transformedContent.replace(
        full,
        `${prefix}-${tokenMatch.token.name}`
      );
      count++;
    }
  }
  
  // Transform border radius utilities
  const radiusUtilityRegex = /rounded-\[(\d+)px\]/g;
  const radiusMatches = [];
  
  // Find all matches first
  while ((match = radiusUtilityRegex.exec(content)) !== null) {
    radiusMatches.push({
      full: match[0],
      value: `${match[1]}px`
    });
  }
  
  // Replace each match
  for (const { full, value } of radiusMatches) {
    const tokenMatch = findBorderRadiusToken(value);
    
    if (tokenMatch && tokenMatch.confidence > 0.7) {
      // Replace with token-based class
      transformedContent = transformedContent.replace(
        full,
        `rounded-${tokenMatch.token.name.replace('radius-', '')}`
      );
      count++;
    }
  }
  
  // Transform shadow utilities
  const shadowUtilityRegex = /shadow-\[(.*?)\]/g;
  const shadowMatches = [];
  
  // Find all matches first
  while ((match = shadowUtilityRegex.exec(content)) !== null) {
    shadowMatches.push({
      full: match[0],
      value: match[1].trim()
    });
  }
  
  // Replace each match
  for (const { full, value } of shadowMatches) {
    const tokenMatch = findShadowToken(value);
    
    if (tokenMatch && tokenMatch.confidence > 0.7) {
      // Replace with token-based class
      transformedContent = transformedContent.replace(
        full,
        `shadow-${tokenMatch.token.name.replace('shadow-', '')}`
      );
      count++;
    }
  }
  
  return { content: transformedContent, count };
}

/**
 * Transform component to use design tokens
 * 
 * @param componentFiles Array of component files to transform
 * @param analysis Component analysis result
 * @returns Transformation result
 */
export async function transformComponent(
  componentFiles: ComponentFile[],
  analysis: ComponentAnalysis
): Promise<TransformationResult> {
  // Initialize transformation summary
  const summary: TransformationSummary = {
    colorsTransformed: 0,
    borderRadiiTransformed: 0,
    shadowsTransformed: 0,
    tailwindClassesTransformed: 0
  };
  
  // Transform each file
  const transformedFiles = await Promise.all(
    componentFiles.map(async (file) => {
      // Skip non-component files
      if (!file.name.endsWith('.tsx') && !file.name.endsWith('.jsx')) {
        return { ...file };
      }
      
      // Transform the content
      let content = file.content;
      
      // Transform token imports if present
      const importResult = transformTokenImports(content, analysis.tokenImports);
      content = importResult.content;
      
      // Transform hex colors
      const colorResult = transformColors(content);
      content = colorResult.content;
      summary.colorsTransformed += colorResult.count;
      
      // Transform rgba colors
      const rgbaResult = transformRgbaColors(content);
      content = rgbaResult.content;
      summary.colorsTransformed += rgbaResult.count;
      
      // Transform border radii
      const borderRadiiResult = transformBorderRadii(content);
      content = borderRadiiResult.content;
      summary.borderRadiiTransformed += borderRadiiResult.count;
      
      // Transform shadows
      const shadowsResult = transformShadows(content);
      content = shadowsResult.content;
      summary.shadowsTransformed += shadowsResult.count;
      
      // Transform Tailwind classes
      const tailwindResult = transformTailwindClasses(content);
      content = tailwindResult.content;
      summary.tailwindClassesTransformed += tailwindResult.count;
      
      return {
        ...file,
        content
      };
    })
  );
  
  return {
    originalFiles: componentFiles,
    transformedFiles,
    summary
  };
}