/**
 * Token Matcher for the Lovable Component Transformer
 * 
 * This module provides utilities for matching component values to design tokens
 */

import { 
  getAllColorTokens,
  getAllBorderRadiusTokens,
  getAllShadowTokens,
  getAllTypographyStyles,
  ColorToken,
  BorderRadiusToken,
  ShadowToken,
  TypographyToken
} from '@tokens/token-index';

/**
 * Token match result with confidence score
 */
export interface TokenMatch<T> {
  /**
   * The matched token
   */
  token: T;
  
  /**
   * Confidence score (0-1)
   */
  confidence: number;
  
  /**
   * Reason for the match
   */
  reason: string;
}

/**
 * Convert hex to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove the hash
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  let r, g, b;
  
  if (hex.length === 3) {
    // Short form (e.g. #RGB)
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    // Long form (e.g. #RRGGBB)
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return null;
  }
  
  return { r, g, b };
}

/**
 * Calculate color distance (uses CIEDE2000 formula simplified)
 */
function colorDistance(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1; // Max distance if conversion fails
  
  // Simple Euclidean distance in RGB space (0-442 range)
  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
  
  // Normalize to 0-1 range (max possible distance is sqrt(255^2 + 255^2 + 255^2) ≈ 442)
  return distance / 442;
}

/**
 * Extract RGB components from rgba string
 */
function rgbaToRgb(rgba: string): { r: number; g: number; b: number; a: number } | null {
  const match = rgba.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/);
  if (!match) return null;
  
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: parseFloat(match[4])
  };
}

/**
 * Find the best match for a color value in the design token system
 */
export function findColorToken(value: string): TokenMatch<ColorToken> | null {
  // Get all color tokens
  const colorTokens = getAllColorTokens();
  
  // No tokens available
  if (!colorTokens.length) return null;
  
  let bestMatch: TokenMatch<ColorToken> | null = null;
  
  // Check if the value is already in CSS variable format
  if (value.startsWith('var(--')) {
    const varMatch = value.match(/var\(--color-([^)]+)\)/);
    if (varMatch) {
      const tokenName = varMatch[1];
      const token = colorTokens.find(t => t.name === tokenName);
      
      if (token) {
        return {
          token,
          confidence: 1,
          reason: 'Exact CSS variable match'
        };
      }
    }
  }
  
  // Process hex colors
  if (value.startsWith('#')) {
    // Standardize hex format (lowercase)
    const normalizedValue = value.toLowerCase();
    
    // Try to find an exact match first
    const exactMatch = colorTokens.find(
      token => token.value.toLowerCase() === normalizedValue
    );
    
    if (exactMatch) {
      return {
        token: exactMatch,
        confidence: 1,
        reason: 'Exact hex match'
      };
    }
    
    // If no exact match, find the closest color
    let minDistance = 1;
    let closestToken: ColorToken | null = null;
    
    for (const token of colorTokens) {
      const distance = colorDistance(normalizedValue, token.value);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestToken = token;
      }
    }
    
    if (closestToken && minDistance < 0.1) { // 10% threshold for "close enough"
      return {
        token: closestToken,
        confidence: 1 - minDistance,
        reason: `Close hex match (${Math.round((1 - minDistance) * 100)}% similar)`
      };
    }
  }
  
  // Process rgba colors
  if (value.startsWith('rgba(')) {
    const rgba = rgbaToRgb(value);
    
    if (rgba) {
      // Convert to hex for comparison (ignoring alpha)
      const hexValue = `#${rgba.r.toString(16).padStart(2, '0')}${rgba.g.toString(16).padStart(2, '0')}${rgba.b.toString(16).padStart(2, '0')}`;
      
      // Find the closest color
      let minDistance = 1;
      let closestToken: ColorToken | null = null;
      
      for (const token of colorTokens) {
        const distance = colorDistance(hexValue, token.value);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestToken = token;
        }
      }
      
      if (closestToken && minDistance < 0.1) { // 10% threshold for "close enough"
        return {
          token: closestToken,
          confidence: 1 - minDistance,
          reason: `RGBA color match (${Math.round((1 - minDistance) * 100)}% similar)`
        };
      }
    }
  }
  
  return null;
}

/**
 * Calculate similarity between two strings (simple version)
 */
function stringSimilarity(str1: string, str2: string): number {
  // Convert to lowercase for comparison
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  
  if (str1 === str2) return 1;
  
  // Calculate Levenshtein distance
  const len1 = str1.length;
  const len2 = str2.length;
  const maxLen = Math.max(len1, len2);
  
  if (maxLen === 0) return 1;
  
  // Use simple includes check for approximation
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.8;
  }
  
  // Use character overlap for approximation
  let matches = 0;
  for (let i = 0; i < len1; i++) {
    if (str2.includes(str1[i])) {
      matches++;
    }
  }
  
  return matches / maxLen;
}

/**
 * Find the best match for a border radius value in the design token system
 */
export function findBorderRadiusToken(value: string): TokenMatch<BorderRadiusToken> | null {
  // Get all border radius tokens
  const borderRadiusTokens = getAllBorderRadiusTokens();
  
  // No tokens available
  if (!borderRadiusTokens.length) return null;
  
  // Check if the value is already in CSS variable format
  if (value.startsWith('var(--')) {
    const varMatch = value.match(/var\(--radius-([^)]+)\)/);
    if (varMatch) {
      const tokenName = varMatch[1];
      const token = borderRadiusTokens.find(t => t.name === `radius-${tokenName}`);
      
      if (token) {
        return {
          token,
          confidence: 1,
          reason: 'Exact CSS variable match'
        };
      }
    }
  }
  
  // Extract numeric values if it's a px or rem value
  let pixelValue: number | null = null;
  
  if (value.endsWith('px')) {
    pixelValue = parseFloat(value);
  } else if (value.endsWith('rem')) {
    pixelValue = parseFloat(value) * 16; // Convert rem to px (assuming 1rem = 16px)
  }
  
  if (pixelValue !== null) {
    // Find exact or closest match
    let exactMatch = borderRadiusTokens.find(token => {
      const tokenPx = token.value.endsWith('px') 
        ? parseFloat(token.value) 
        : token.value.endsWith('rem')
          ? parseFloat(token.value) * 16
          : null;
          
      return tokenPx === pixelValue;
    });
    
    if (exactMatch) {
      return {
        token: exactMatch,
        confidence: 1,
        reason: 'Exact pixel value match'
      };
    }
    
    // Find closest match
    let closestToken: BorderRadiusToken | null = null;
    let minDifference = Number.MAX_VALUE;
    
    for (const token of borderRadiusTokens) {
      const tokenPx = token.value.endsWith('px') 
        ? parseFloat(token.value) 
        : token.value.endsWith('rem')
          ? parseFloat(token.value) * 16
          : null;
      
      if (tokenPx !== null) {
        const difference = Math.abs(tokenPx - pixelValue);
        
        if (difference < minDifference) {
          minDifference = difference;
          closestToken = token;
        }
      }
    }
    
    if (closestToken) {
      // Calculate confidence (inverse of relative difference)
      const tokenPx = closestToken.value.endsWith('px') 
        ? parseFloat(closestToken.value) 
        : parseFloat(closestToken.value) * 16;
        
      // Maximum allowed difference is 4px or 25% of the value
      const maxDiff = Math.max(4, pixelValue * 0.25);
      const confidence = Math.max(0, 1 - (minDifference / maxDiff));
      
      if (confidence > 0.7) {
        return {
          token: closestToken,
          confidence,
          reason: `Close pixel value match (${pixelValue}px ≈ ${tokenPx}px)`
        };
      }
    }
  }
  
  // Handle Tailwind class names
  if (value.startsWith('rounded')) {
    // Direct class mapping
    const classMap: Record<string, string> = {
      'rounded-sm': 'radius-sm',
      'rounded': 'radius-base',
      'rounded-md': 'radius-md',
      'rounded-lg': 'radius-lg',
      'rounded-xl': 'radius-xl',
      'rounded-2xl': 'radius-2xl',
      'rounded-3xl': 'radius-3xl',
      'rounded-full': 'radius-full'
    };
    
    if (classMap[value]) {
      const token = borderRadiusTokens.find(t => t.name === classMap[value]);
      
      if (token) {
        return {
          token,
          confidence: 1,
          reason: 'Exact Tailwind class match'
        };
      }
    }
    
    // Look for fuzzy matches for custom rounded classes
    let bestMatch: BorderRadiusToken | null = null;
    let highestConfidence = 0;
    
    for (const token of borderRadiusTokens) {
      const similarity = stringSimilarity(value, token.name);
      
      if (similarity > highestConfidence) {
        highestConfidence = similarity;
        bestMatch = token;
      }
    }
    
    if (bestMatch && highestConfidence > 0.7) {
      return {
        token: bestMatch,
        confidence: highestConfidence,
        reason: `Similar border radius name (${Math.round(highestConfidence * 100)}% match)`
      };
    }
  }
  
  return null;
}

/**
 * Find the best match for a shadow value in the design token system
 */
export function findShadowToken(value: string): TokenMatch<ShadowToken> | null {
  // Get all shadow tokens
  const shadowTokens = getAllShadowTokens();
  
  // No tokens available
  if (!shadowTokens.length) return null;
  
  // Check if the value is already in CSS variable format
  if (value.startsWith('var(--')) {
    const varMatch = value.match(/var\(--shadow-([^)]+)\)/);
    if (varMatch) {
      const tokenName = varMatch[1];
      const token = shadowTokens.find(t => t.name === `shadow-${tokenName}`);
      
      if (token) {
        return {
          token,
          confidence: 1,
          reason: 'Exact CSS variable match'
        };
      }
    }
  }
  
  // Handle Tailwind shadow classes
  if (value.startsWith('shadow')) {
    // Direct class mapping
    const classMap: Record<string, string> = {
      'shadow-sm': 'shadow-sm',
      'shadow': 'shadow-base',
      'shadow-md': 'shadow-md',
      'shadow-lg': 'shadow-lg',
      'shadow-xl': 'shadow-xl',
      'shadow-2xl': 'shadow-2xl',
      'shadow-inner': 'shadow-inner'
    };
    
    if (classMap[value]) {
      const token = shadowTokens.find(t => t.name === classMap[value]);
      
      if (token) {
        return {
          token,
          confidence: 1,
          reason: 'Exact Tailwind shadow class match'
        };
      }
    }
  }
  
  // For shadow values, normalize and compare
  const normalizedValue = normalizeShadowValue(value);
  
  // Try exact match
  const exactMatch = shadowTokens.find(token => {
    return normalizeShadowValue(token.cssValue) === normalizedValue;
  });
  
  if (exactMatch) {
    return {
      token: exactMatch,
      confidence: 1,
      reason: 'Exact shadow value match'
    };
  }
  
  // Try to match based on similarity
  let bestMatch: ShadowToken | null = null;
  let highestSimilarity = 0;
  
  for (const token of shadowTokens) {
    const normalizedToken = normalizeShadowValue(token.cssValue);
    const similarity = shadowSimilarity(normalizedValue, normalizedToken);
    
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = token;
    }
  }
  
  if (bestMatch && highestSimilarity > 0.7) {
    return {
      token: bestMatch,
      confidence: highestSimilarity,
      reason: `Similar shadow value (${Math.round(highestSimilarity * 100)}% match)`
    };
  }
  
  return null;
}

/**
 * Normalize shadow value for comparison
 */
function normalizeShadowValue(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ', ')
    .trim()
    .toLowerCase();
}

/**
 * Calculate similarity between two shadow values
 */
function shadowSimilarity(shadow1: string, shadow2: string): number {
  if (shadow1 === shadow2) return 1;
  
  // Parse shadow components (simplified)
  const components1 = parseShadowComponents(shadow1);
  const components2 = parseShadowComponents(shadow2);
  
  if (!components1 || !components2) return 0;
  
  // Compare components
  let similarityScore = 0;
  
  // Compare offset-x (max difference 10px)
  const xDiff = Math.abs(components1.offsetX - components2.offsetX);
  similarityScore += Math.max(0, 1 - (xDiff / 10));
  
  // Compare offset-y (max difference 10px)
  const yDiff = Math.abs(components1.offsetY - components2.offsetY);
  similarityScore += Math.max(0, 1 - (yDiff / 10));
  
  // Compare blur radius (max difference 15px)
  const blurDiff = Math.abs(components1.blurRadius - components2.blurRadius);
  similarityScore += Math.max(0, 1 - (blurDiff / 15));
  
  // Compare color opacity (if available)
  if (components1.opacity !== null && components2.opacity !== null) {
    const opacityDiff = Math.abs(components1.opacity - components2.opacity);
    similarityScore += Math.max(0, 1 - (opacityDiff / 0.5));
  } else {
    // Skip opacity comparison
    return similarityScore / 3;
  }
  
  // Return average
  return similarityScore / 4;
}

/**
 * Parse shadow components for comparison
 */
function parseShadowComponents(shadow: string): {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  opacity: number | null;
} | null {
  // Simple regex to extract common shadow parts
  const regex = /(-?\d+px)\s+(-?\d+px)\s+(-?\d+px)(?:\s+(-?\d+px))?\s+rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/;
  const insetRegex = /inset\s+(-?\d+px)\s+(-?\d+px)\s+(-?\d+px)(?:\s+(-?\d+px))?\s+rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/;
  
  let match = shadow.match(regex) || shadow.match(insetRegex);
  
  if (!match) {
    // Try alternative pattern with hex color
    const hexRegex = /(-?\d+px)\s+(-?\d+px)\s+(-?\d+px)(?:\s+(-?\d+px))?\s+#[0-9a-f]{3,8}/i;
    const insetHexRegex = /inset\s+(-?\d+px)\s+(-?\d+px)\s+(-?\d+px)(?:\s+(-?\d+px))?\s+#[0-9a-f]{3,8}/i;
    match = shadow.match(hexRegex) || shadow.match(insetHexRegex);
    
    if (!match) return null;
    
    // Use default opacity with hex colors
    return {
      offsetX: parseInt(match[1]),
      offsetY: parseInt(match[2]),
      blurRadius: parseInt(match[3]),
      spreadRadius: match[4] ? parseInt(match[4]) : 0,
      opacity: 1 // Assume full opacity for hex colors
    };
  }
  
  return {
    offsetX: parseInt(match[1]),
    offsetY: parseInt(match[2]),
    blurRadius: parseInt(match[3]),
    spreadRadius: match[4] ? parseInt(match[4]) : 0,
    opacity: match[8] ? parseFloat(match[8]) : null
  };
}

/**
 * Create a copy of object with only needed properties
 */
export function sanitizeToken<T>(token: T): T {
  if (!token) return token;
  
  // For ColorToken, keep only name and value
  if ('value' in (token as any) && 'name' in (token as any)) {
    return {
      name: (token as any).name,
      value: (token as any).value
    } as unknown as T;
  }
  
  return token;
}