#!/usr/bin/env node

/**
 * Script for analyzing and transforming components from the test repository
 * This script demonstrates the dynamic token matching system
 */

const path = require('path');
const fs = require('fs/promises');
const util = require('util');
const { exec } = require('child_process');

// Convert exec to Promise-based
const execAsync = util.promisify(exec);

// Test repository path
const TEST_REPO = path.join(process.cwd(), 'tmp/test-repo');

/**
 * Get component files from a directory
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
 * Analyze component files
 */
async function analyzeComponent(componentFiles) {
  const analysis = {
    colors: new Set(),
    rgbaColors: new Set(),
    borderRadii: new Set(),
    shadows: new Set(),
    tailwindClasses: [],
    tokenImports: []
  };
  
  // Extract values from each file
  for (const file of componentFiles) {
    // Extract hex colors
    const hexRegex = /#([0-9A-Fa-f]{3}){1,2}\b/g;
    const hexMatches = file.content.match(hexRegex) || [];
    hexMatches.forEach(color => analysis.colors.add(color));
    
    // Extract rgba colors
    const rgbaRegex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)/g;
    const rgbaMatches = file.content.match(rgbaRegex) || [];
    rgbaMatches.forEach(color => analysis.rgbaColors.add(color));
    
    // Extract border radii
    const borderRadiusRegex = /border-radius:\s*(\d+)px|rounded(-[a-z]+)*\b|rounded-\[(\d+)px\]/g;
    const borderRadiusMatches = file.content.match(borderRadiusRegex) || [];
    borderRadiusMatches.forEach(radius => analysis.borderRadii.add(radius));
    
    // Extract shadows
    const shadowRegex = /box-shadow:\s*([^;]+)|shadow(-[a-z0-9]+)?\b|shadow-\[(.*?)\]/g;
    const shadowMatches = file.content.match(shadowRegex) || [];
    shadowMatches.forEach(shadow => analysis.shadows.add(shadow));
    
    // Extract token imports
    const importRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+["']([^"']+)["'];?/g;
    let match;
    while ((match = importRegex.exec(file.content)) !== null) {
      const tokens = match[1].split(',').map(t => t.trim());
      const source = match[2];
      
      if (source.includes('design-token') || source.includes('design-system')) {
        analysis.tokenImports.push({ source, tokens });
      }
    }
    
    // Extract Tailwind classes
    const classRegex = /className="([^"]+)"|className={`([^`]+)`}|cn\(([^)]+)\)/g;
    let classMatch;
    while ((classMatch = classRegex.exec(file.content)) !== null) {
      const classString = classMatch[1] || classMatch[2] || classMatch[3];
      const classes = classString.split(/\s+/);
      analysis.tailwindClasses.push(...classes);
    }
  }
  
  return {
    colors: [...analysis.colors],
    rgbaColors: [...analysis.rgbaColors],
    borderRadii: [...analysis.borderRadii],
    shadows: [...analysis.shadows],
    tailwindClasses: analysis.tailwindClasses,
    tokenImports: analysis.tokenImports
  };
}

/**
 * Transform component files
 */
async function transformComponent(componentFiles, analysis) {
  // Simple token maps for standalone script
  const colorMap = {
    '#FFFFFF': 'neutral-white',
    '#555555': 'neutral-charcoal',
    '#25C9D0': 'olivia-blue',
    '#BDE6E8': 'olivia-blue-t600',
    '#CCF4F3': 'olivia-blue-t700',
    '#E5FCFB': 'olivia-blue-t900',
    '#F7FFFF': 'olivia-blue-t950',
    '#395E66': 'midnight-teal',
    '#A9A9A9': 'grey-earl',
    '#DADCE0': 'grey-steel',
    '#F2F2F2': 'grey-disco',
    '#F8F8F8': 'grey-fog',
    'rgba(37,201,208,1)': 'olivia-blue',
    'rgba(189,230,232,1)': 'olivia-blue-t600',
    'rgba(169,169,169,1)': 'grey-earl',
    'rgba(85,85,85,1)': 'neutral-charcoal'
  };
  
  const borderRadiusMap = {
    'rounded-sm': 'sm',
    'rounded': 'base',
    'rounded-lg': 'lg',
    'rounded-xl': 'xl',
    'rounded-2xl': '2xl'
  };
  
  const shadowMap = {
    'shadow-sm': 'sm',
    'shadow': 'base',
    'shadow-md': 'md',
    'shadow-lg': 'lg',
    'shadow-xl': 'xl'
  };
  
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
      let content = file.content;
      
      // Transform hex colors
      for (const color of analysis.colors) {
        if (colorMap[color]) {
          content = content.replace(
            new RegExp(color, 'g'),
            `var(--color-${colorMap[color]})`
          );
          summary.colorsTransformed++;
        }
      }
      
      // Transform rgba colors
      for (const color of analysis.rgbaColors) {
        if (colorMap[color]) {
          content = content.replace(
            new RegExp(color.replace(/([()])/g, '\\$1'), 'g'),
            `var(--color-${colorMap[color]})`
          );
          summary.colorsTransformed++;
        }
      }
      
      // Transform token imports and usage
      if (analysis.tokenImports.length > 0) {
        // Replace direct token access patterns
        content = content.replace(/colors\.([a-zA-Z0-9]+)/g, (match, colorName) => {
          const tokenName = colorName
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .replace(/^-/, '');
          return `getColorValue('${tokenName}')`;
        });
        
        content = content.replace(/borderRadius\.([a-zA-Z0-9]+)/g, (match, name) => {
          return `getBorderRadiusValue('radius-${borderRadiusMap[name] || name}')`;
        });
        
        content = content.replace(/shadows\.([a-zA-Z0-9]+)/g, (match, name) => {
          return `getShadowValue('shadow-${shadowMap[name] || name}')`;
        });
      }
      
      // Transform border radius classes
      for (const radius of analysis.borderRadii) {
        if (borderRadiusMap[radius]) {
          content = content.replace(
            new RegExp(`\\b${radius}\\b`, 'g'),
            `rounded-${borderRadiusMap[radius]}`
          );
          summary.borderRadiiTransformed++;
        }
      }
      
      // Transform shadow classes, but be careful with property names
      for (const shadow of analysis.shadows) {
        if (shadowMap[shadow]) {
          // Don't transform if it's in a property name or variable name
          content = content.replace(
            new RegExp(`\\b${shadow}\\b(?![-:]|\\s*=)`, 'g'),
            `shadow-${shadowMap[shadow]}`
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
 * Main function
 */
async function main() {
  try {
    console.log('Testing Dynamic Token Matcher with Design System Components');
    console.log('=====================================================');
    
    // Get design system component files
    const designSystemPath = path.join(TEST_REPO, 'src/components/design-system');
    if (!await fs.access(designSystemPath).then(() => true).catch(() => false)) {
      console.error(`Test repository not found at ${TEST_REPO}`);
      console.log('Make sure to clone the test repository first:');
      console.log('git clone https://github.com/Widoba/p-562375.git tmp/test-repo');
      return;
    }
    
    const componentFiles = await getComponentFiles(designSystemPath);
    console.log(`\nFound ${componentFiles.length} component files in test repository`);
    
    // Analyze component
    console.log('\nAnalyzing components...');
    const analysis = await analyzeComponent(componentFiles);
    
    // Display analysis results
    console.log('\nAnalysis Results:');
    console.log(`- Hex Colors: ${analysis.colors.length}`);
    console.log(`- RGBA Colors: ${analysis.rgbaColors.length}`);
    console.log(`- Border Radii: ${analysis.borderRadii.length}`);
    console.log(`- Shadows: ${analysis.shadows.length}`);
    console.log(`- Token Imports: ${analysis.tokenImports ? analysis.tokenImports.length : 0}`);
    console.log(`- Tailwind Classes: ${analysis.tailwindClasses.length}`);
    
    // Transform component
    console.log('\nTransforming components...');
    const transformResult = await transformComponent(componentFiles, analysis);
    
    // Display transformation summary
    console.log('\nTransformation Summary:');
    console.log(`- Colors Transformed: ${transformResult.summary.colorsTransformed}`);
    console.log(`- Border Radii Transformed: ${transformResult.summary.borderRadiiTransformed}`);
    console.log(`- Shadows Transformed: ${transformResult.summary.shadowsTransformed}`);
    console.log(`- Tailwind Classes Transformed: ${transformResult.summary.tailwindClassesTransformed}`);
    
    // Get output directory path
    const outputDir = path.join(process.cwd(), 'tmp/transformed-design-system');
    
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