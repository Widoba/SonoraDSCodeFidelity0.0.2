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
  
  // Load all tokens
  const colorTokens = getAllColorTokens();
  const borderRadiusTokens = getAllBorderRadiusTokens();
  const shadowTokens = getAllShadowTokens();
  
  // Transform each file
  const transformedFiles = await Promise.all(
    componentFiles.map(async (file) => {
      // Skip non-component files
      if (!file.name.endsWith('.tsx') && !file.name.endsWith('.jsx')) {
        return { ...file };
      }
      
      // Transform the content
      let content = file.content;
      
      // Transform colors
      const colorResult = transformColors(content, colorTokens);
      content = colorResult.content;
      summary.colorsTransformed += colorResult.count;
      
      // Transform border radii
      const borderRadiiResult = transformBorderRadii(content, borderRadiusTokens);
      content = borderRadiiResult.content;
      summary.borderRadiiTransformed += borderRadiiResult.count;
      
      // Transform shadows
      const shadowsResult = transformShadows(content, shadowTokens);
      content = shadowsResult.content;
      summary.shadowsTransformed += shadowsResult.count;
      
      // Transform Tailwind classes
      const tailwindResult = transformTailwindClasses(
        content, 
        colorTokens, 
        borderRadiusTokens, 
        shadowTokens
      );
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

/**
 * Transform hex colors to use design tokens
 * 
 * @param content File content
 * @param colorTokens Available color tokens
 * @returns Transformed content and transformation count
 */
function transformColors(content: string, colorTokens: any[]): { content: string; count: number } {
  let transformedContent = content;
  let count = 0;
  
  // Replace hex colors with token variables
  // Match hex colors (#fff, #ffffff, etc.)
  const hexRegex = /#([0-9A-Fa-f]{3}){1,2}\b/g;
  const matches = content.match(hexRegex) || [];
  
  for (const hexColor of matches) {
    // Find matching token
    const normalizedColor = hexColor.toLowerCase();
    const token = colorTokens.find(t => t.value.toLowerCase() === normalizedColor);
    
    if (token) {
      // Replace with CSS variable
      transformedContent = transformedContent.replace(
        new RegExp(hexColor, 'g'),
        `var(--color-${token.name})`
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
 * @param borderRadiusTokens Available border radius tokens
 * @returns Transformed content and transformation count
 */
function transformBorderRadii(content: string, borderRadiusTokens: any[]): { content: string; count: number } {
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
    const token = borderRadiusTokens.find(t => t.value === value);
    
    if (token) {
      // Replace with CSS variable
      transformedContent = transformedContent.replace(
        full,
        `border-radius: var(--radius-${token.name.replace('radius-', '')})`
      );
      count++;
    }
  }
  
  return { content: transformedContent, count };
}

/**
 * Transform shadows to use design tokens
 * 
 * @param content File content
 * @param shadowTokens Available shadow tokens
 * @returns Transformed content and transformation count
 */
function transformShadows(content: string, shadowTokens: any[]): { content: string; count: number } {
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
    // Normalize value for comparison
    const normalizedValue = value.replace(/\s+/g, ' ').trim();
    
    // Find token with matching shadow value
    const token = shadowTokens.find(t => {
      const normalizedToken = t.cssValue.replace(/\s+/g, ' ').trim();
      return normalizedValue === normalizedToken;
    });
    
    if (token) {
      // Replace with CSS variable
      transformedContent = transformedContent.replace(
        full,
        `box-shadow: var(--shadow-${token.name.replace('shadow-', '')})`
      );
      count++;
    }
  }
  
  return { content: transformedContent, count };
}

/**
 * Transform Tailwind classes to use design tokens
 * 
 * @param content File content
 * @param colorTokens Available color tokens
 * @param borderRadiusTokens Available border radius tokens
 * @param shadowTokens Available shadow tokens
 * @returns Transformed content and transformation count
 */
function transformTailwindClasses(
  content: string,
  colorTokens: any[],
  borderRadiusTokens: any[],
  shadowTokens: any[]
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
    
    const token = colorTokens.find(t => t.value.toLowerCase() === fullHex.toLowerCase());
    
    if (token) {
      // Replace with token-based class
      transformedContent = transformedContent.replace(
        full,
        `${prefix}-${token.name}`
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
    const token = borderRadiusTokens.find(t => t.value === value);
    
    if (token) {
      // Replace with token-based class
      transformedContent = transformedContent.replace(
        full,
        `rounded-${token.name.replace('radius-', '')}`
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
    // Normalize value for comparison
    const normalizedValue = value.replace(/\s+/g, ' ').trim();
    
    // Find token with matching shadow value
    const token = shadowTokens.find(t => {
      const normalizedToken = t.cssValue.replace(/\s+/g, ' ').trim();
      return normalizedValue === normalizedToken;
    });
    
    if (token) {
      // Replace with token-based class
      transformedContent = transformedContent.replace(
        full,
        `shadow-${token.name.replace('shadow-', '')}`
      );
      count++;
    }
  }
  
  return { content: transformedContent, count };
}