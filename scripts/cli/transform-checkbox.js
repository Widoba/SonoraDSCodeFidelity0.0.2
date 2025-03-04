#!/usr/bin/env node

/**
 * Script for analyzing and transforming the Lovable Checkbox component
 * This script demonstrates the transformation of a real component
 */

const path = require('path');
const fs = require('fs/promises');
const util = require('util');
const { exec } = require('child_process');

// Convert exec to Promise-based
const execAsync = util.promisify(exec);

// Checkbox repository
const CHECKBOX_REPO = path.join(process.cwd(), 'tmp/checkbox-component');

/**
 * Extract hex color values from code
 */
function extractHexColors(content) {
  // Match hex colors (#fff, #ffffff, etc.)
  const hexRegex = /#([0-9A-Fa-f]{3}){1,2}\b/g;
  const matches = content.match(hexRegex) || [];
  return matches;
}

/**
 * Extract rgba color values from code
 */
function extractRgbaColors(content) {
  // Match rgba colors
  const rgbaRegex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/g;
  const matches = content.match(rgbaRegex) || [];
  return matches;
}

/**
 * Extract border radius values from code
 */
function extractBorderRadii(content) {
  // Match border-radius CSS properties
  const cssRadiusRegex = /border-radius:\s*(\d+)px/g;
  const cssMatches = [];
  let match;
  
  while ((match = cssRadiusRegex.exec(content)) !== null) {
    cssMatches.push(`${match[1]}px`);
  }

  // Match Tailwind rounded classes with px values
  const twRadiusRegex = /rounded-\[(\d+)px\]/g;
  const twMatches = [];
  
  while ((match = twRadiusRegex.exec(content)) !== null) {
    twMatches.push(`${match[1]}px`);
  }

  // Also match standard Tailwind rounded classes
  const stdTwRadiusRegex = /rounded(-[a-z]+)*\b/g;
  while ((match = stdTwRadiusRegex.exec(content)) !== null) {
    if (!match[0].includes("rounded-[")) {
      twMatches.push(match[0]);
    }
  }

  return [...cssMatches, ...twMatches];
}

/**
 * Extract shadow values from code
 */
function extractShadows(content) {
  // Match box-shadow CSS properties
  const cssShadowRegex = /box-shadow:\s*([^;]+)/g;
  const cssMatches = [];
  let match;
  
  while ((match = cssShadowRegex.exec(content)) !== null) {
    cssMatches.push(match[1].trim());
  }

  // Match Tailwind shadow classes with values
  const twShadowRegex = /shadow-\[(.*?)\]/g;
  const twMatches = [];
  
  while ((match = twShadowRegex.exec(content)) !== null) {
    twMatches.push(match[1].trim());
  }

  // Also match standard Tailwind shadow classes
  const stdTwShadowRegex = /shadow(-[a-z]+)?\b/g;
  while ((match = stdTwShadowRegex.exec(content)) !== null) {
    if (!match[0].includes("shadow-[")) {
      twMatches.push(match[0]);
    }
  }

  return [...cssMatches, ...twMatches];
}

/**
 * Extract Tailwind classes from code
 */
function extractTailwindClasses(content) {
  // Match className attributes with Tailwind classes
  const classNameRegex = /className="([^"]+)"/g;
  const classes = [];
  let match;
  
  while ((match = classNameRegex.exec(content)) !== null) {
    // Split class string into individual classes
    const classNames = match[1].split(/\s+/);
    classes.push(...classNames);
  }

  // Also look for className with template literals
  const templateRegex = /className={`([^`]+)`}/g;
  while ((match = templateRegex.exec(content)) !== null) {
    // Split class string into individual classes
    const classNames = match[1].split(/\s+/);
    classes.push(...classNames);
  }

  // Check for cn usage (Tailwind merge utility)
  const cnRegex = /cn\(([^)]+)\)/g;
  while ((match = cnRegex.exec(content)) !== null) {
    // This is more complex, but try to extract string literals
    const cnContent = match[1];
    const stringMatches = cnContent.match(/"([^"]+)"|'([^']+)'|`([^`]+)`/g) || [];
    
    for (const stringMatch of stringMatches) {
      // Remove quotes and split by whitespace
      const cleanString = stringMatch.slice(1, -1);
      const classNames = cleanString.split(/\s+/);
      classes.push(...classNames);
    }
  }

  return classes;
}

/**
 * Categorize Tailwind classes
 */
function categorizeClasses(classes) {
  const categories = {
    color: [],
    spacing: [],
    typography: [],
    layout: [],
    other: []
  };
  
  for (const cls of classes) {
    if (cls.startsWith('text-') && !cls.startsWith('text-sm') && !cls.startsWith('text-lg') || 
        cls.startsWith('bg-') || 
        cls.startsWith('border-') && !cls.startsWith('border-0') && !cls.startsWith('border-2')) {
      categories.color.push(cls);
    } else if (cls.startsWith('p-') || cls.startsWith('m-') || 
               cls.startsWith('px-') || cls.startsWith('py-') ||
               cls.startsWith('pt-') || cls.startsWith('pr-') ||
               cls.startsWith('pb-') || cls.startsWith('pl-') ||
               cls.startsWith('mx-') || cls.startsWith('my-') ||
               cls.startsWith('mt-') || cls.startsWith('mr-') ||
               cls.startsWith('mb-') || cls.startsWith('ml-') ||
               cls.startsWith('gap-')) {
      categories.spacing.push(cls);
    } else if (cls.startsWith('font-') || 
               cls.startsWith('text-') || 
               cls.startsWith('leading-') ||
               cls.startsWith('tracking-') ||
               cls.startsWith('align-')) {
      categories.typography.push(cls);
    } else if (cls.startsWith('flex') || 
               cls.startsWith('grid') || 
               cls.startsWith('justify-') ||
               cls.startsWith('items-') ||
               cls.startsWith('self-') ||
               cls.startsWith('col-') ||
               cls.startsWith('row-')) {
      categories.layout.push(cls);
    } else {
      categories.other.push(cls);
    }
  }
  
  return categories;
}

/**
 * Analyze a component for values that can be converted to tokens
 */
async function analyzeComponent(componentFiles) {
  const analysis = {
    colors: new Set(),
    rgbaColors: new Set(),
    borderRadii: new Set(),
    shadows: new Set(),
    tailwindClasses: []
  };

  // Extract all values from component files
  for (const file of componentFiles) {
    // Skip non-component files
    if (!file.name.endsWith('.tsx') && !file.name.endsWith('.jsx')) {
      continue;
    }

    console.log(`\nAnalyzing file: ${file.name}`);
    const content = file.content;

    // Extract color values (hex)
    const hexColors = extractHexColors(content);
    hexColors.forEach(color => analysis.colors.add(color));
    
    // Extract rgba colors
    const rgbaColors = extractRgbaColors(content);
    rgbaColors.forEach(color => analysis.rgbaColors.add(color));

    // Extract border-radius values
    const borderRadii = extractBorderRadii(content);
    borderRadii.forEach(radius => analysis.borderRadii.add(radius));

    // Extract shadow values
    const shadows = extractShadows(content);
    shadows.forEach(shadow => analysis.shadows.add(shadow));

    // Extract Tailwind classes
    const tailwindClasses = extractTailwindClasses(content);
    analysis.tailwindClasses = [
      ...analysis.tailwindClasses,
      ...tailwindClasses
    ];
  }

  return {
    colors: [...analysis.colors],
    rgbaColors: [...analysis.rgbaColors],
    borderRadii: [...analysis.borderRadii],
    shadows: [...analysis.shadows],
    tailwindClasses: analysis.tailwindClasses
  };
}

/**
 * Get color token from hex or rgba value
 */
function getColorToken(colorValue) {
  // Map of hardcoded colors to tokens based on Sonora DS
  const colorMap = {
    '#FFFFFF': { name: 'neutral-white', value: '#FFFFFF' },
    '#fff': { name: 'neutral-white', value: '#FFFFFF' },
    '#555555': { name: 'neutral-charcoal', value: '#555555' },
    '#555': { name: 'neutral-charcoal', value: '#555555' },
    '#25C9D0': { name: 'olivia-blue', value: '#25C9D0' },
    '#25c9d0': { name: 'olivia-blue', value: '#25C9D0' },
    '#0BB4BA': { name: 'olivia-blue-dark', value: '#0BB4BA' },
    '#BDE6E8': { name: 'olivia-blue-t600', value: '#BDE6E8' },
    '#bde6e8': { name: 'olivia-blue-t600', value: '#BDE6E8' },
    '#CCF4F3': { name: 'olivia-blue-t700', value: '#CCF4F3' },
    '#E5FCFB': { name: 'olivia-blue-t900', value: '#E5FCFB' },
    '#F7FFFF': { name: 'olivia-blue-t950', value: '#F7FFFF' },
    '#DADCE0': { name: 'grey-steel', value: '#DADCE0' },
    '#dadce0': { name: 'grey-steel', value: '#DADCE0' },
    '#F2F2F2': { name: 'grey-disco', value: '#F2F2F2' },
    '#A9A9A9': { name: 'grey-earl', value: '#A9A9A9' },
    '#a9a9a9': { name: 'grey-earl', value: '#A9A9A9' },
    // Add RGBA mappings
    'rgba(37,201,208,1)': { name: 'olivia-blue', value: '#25C9D0' },
    'rgba(189,230,232,1)': { name: 'olivia-blue-t600', value: '#BDE6E8' },
    'rgba(169,169,169,1)': { name: 'grey-earl', value: '#A9A9A9' },
    'rgba(85,85,85,1)': { name: 'neutral-charcoal', value: '#555555' },
    'rgba(0,0,0,0.2)': { name: 'shadow-sm', cssValue: '0px 1px 2px rgba(0, 0, 0, 0.2)' },
  };
  
  return colorMap[colorValue];
}

/**
 * Get border radius token
 */
function getBorderRadiusToken(radiusValue) {
  // Map of hardcoded border radii to tokens
  const radiusMap = {
    'rounded-sm': { name: 'radius-sm', value: '0.125rem' },
    '2px': { name: 'radius-sm', value: '0.125rem' }, 
    '4px': { name: 'radius-md', value: '0.25rem' },
    '8px': { name: 'radius-lg', value: '0.5rem' },
    '16px': { name: 'radius-xl', value: '1rem' },
    '24px': { name: 'radius-2xl', value: '1.5rem' },
    '32px': { name: 'radius-3xl', value: '2rem' },
    '9999px': { name: 'radius-full', value: '9999px' },
  };
  
  return radiusMap[radiusValue];
}

/**
 * Get shadow token
 */
function getShadowToken(shadowValue) {
  // Map of hardcoded shadows to tokens
  const shadowMap = {
    'inset 0px 1px 2px rgba(0,0,0,0.2)': { name: 'shadow-inner', cssValue: 'inset 0px 1px 2px rgba(0, 0, 0, 0.2)' },
    '0px 1px 2px 0px rgba(0,0,0,0.20) inset': { name: 'shadow-inner', cssValue: 'inset 0px 1px 2px rgba(0, 0, 0, 0.2)' },
    'shadow-sm': { name: 'shadow-sm', cssValue: '0px 1px 2px rgba(0, 0, 0, 0.2)' },
  };
  
  return shadowMap[shadowValue];
}

/**
 * Transform component to use design tokens
 */
async function transformComponent(componentFiles, analysis) {
  // Initialize transformation summary
  const summary = {
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
      
      // Transform hex colors
      for (const color of analysis.colors) {
        const token = getColorToken(color);
        if (token) {
          // Replace with CSS variable
          content = content.replace(
            new RegExp(color, 'g'),
            `var(--color-${token.name})`
          );
          summary.colorsTransformed++;
        }
      }
      
      // Transform rgba colors
      for (const color of analysis.rgbaColors) {
        const token = getColorToken(color);
        if (token) {
          // Replace with CSS variable
          content = content.replace(
            new RegExp(color.replace(/([()])/g, '\\$1'), 'g'),
            `var(--color-${token.name})`
          );
          summary.colorsTransformed++;
        }
      }
      
      // Transform Tailwind color classes
      const colorClassRegex = /(bg|text|border)-\[(#[0-9A-Fa-f]{3,6}|rgba\([^)]+\))\]/g;
      let match;
      while ((match = colorClassRegex.exec(file.content)) !== null) {
        const prefix = match[1];
        const colorValue = match[2];
        const token = getColorToken(colorValue);
        
        if (token) {
          // Replace with token-based class
          content = content.replace(
            match[0],
            `${prefix}-${token.name}`
          );
          summary.tailwindClassesTransformed++;
        }
      }
      
      // Transform border radius classes
      const radiusRegex = /rounded-\[([^]]+)\]/g;
      while ((match = radiusRegex.exec(file.content)) !== null) {
        const radiusValue = match[1];
        const token = getBorderRadiusToken(radiusValue);
        
        if (token) {
          // Replace with token-based class
          content = content.replace(
            match[0],
            `rounded-${token.name.replace('radius-', '')}`
          );
          summary.borderRadiiTransformed++;
        }
      }
      
      // Transform shadow classes
      const shadowRegex = /shadow-\[([^]]+)\]/g;
      while ((match = shadowRegex.exec(file.content)) !== null) {
        const shadowValue = match[1];
        const token = getShadowToken(shadowValue);
        
        if (token) {
          // Replace with token-based class
          content = content.replace(
            match[0],
            `shadow-${token.name.replace('shadow-', '')}`
          );
          summary.shadowsTransformed++;
        }
      }
      
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
 * Get component files
 */
async function getComponentFiles(componentPath) {
  const files = [];
  
  // Read all files in the component directory
  const entries = await fs.readdir(componentPath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
      const filePath = path.join(componentPath, entry.name);
      const content = await fs.readFile(filePath, 'utf-8');
      
      files.push({
        name: entry.name,
        path: filePath,
        content
      });
    }
  }
  
  return files;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Transforming Lovable Checkbox Component');
    console.log('======================================');
    
    // Get checkbox component files
    const checkboxPath = path.join(CHECKBOX_REPO, 'src/components/checkbox');
    const componentFiles = await getComponentFiles(checkboxPath);
    
    console.log(`\nFound ${componentFiles.length} component files`);
    
    // Analyze component
    console.log('\nAnalyzing component...');
    const analysis = await analyzeComponent(componentFiles);
    
    // Display analysis results
    console.log('\nAnalysis Results:');
    console.log('Colors:');
    analysis.colors.forEach(color => console.log(`- ${color}`));
    
    console.log('\nRGBA Colors:');
    analysis.rgbaColors.forEach(color => console.log(`- ${color}`));
    
    console.log('\nBorder Radii:');
    analysis.borderRadii.forEach(radius => console.log(`- ${radius}`));
    
    console.log('\nShadows:');
    analysis.shadows.forEach(shadow => console.log(`- ${shadow}`));
    
    console.log('\nTailwind Classes:');
    const tailwindCategories = categorizeClasses(analysis.tailwindClasses);
    Object.entries(tailwindCategories).forEach(([category, classes]) => {
      if (classes.length > 0) {
        console.log(`- ${category}: ${classes.join(', ')}`);
      }
    });
    
    // Transform component
    console.log('\nTransforming component to use design tokens...');
    const transformResult = await transformComponent(componentFiles, analysis);
    
    // Display transformation summary
    console.log('\nTransformation Summary:');
    console.log(`- Colors Transformed: ${transformResult.summary.colorsTransformed}`);
    console.log(`- Border Radii Transformed: ${transformResult.summary.borderRadiiTransformed}`);
    console.log(`- Shadows Transformed: ${transformResult.summary.shadowsTransformed}`);
    console.log(`- Tailwind Classes Transformed: ${transformResult.summary.tailwindClassesTransformed}`);
    
    // Get output directory path
    const outputDir = path.join(process.cwd(), 'tmp/transformed-checkbox');
    
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write transformed files
    for (const file of transformResult.transformedFiles) {
      const outputPath = path.join(outputDir, file.name);
      
      // Write transformed file
      await fs.writeFile(outputPath, file.content);
      console.log(`Saved: ${outputPath}`);
    }
    
    console.log(`\nTransformed files saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();