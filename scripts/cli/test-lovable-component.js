#!/usr/bin/env node

/**
 * This is a test script for the Lovable Component Transformer
 * focusing on Phase 2: component analysis and transformation
 */

const path = require('path');
const fs = require('fs/promises');
const { LocalCloneAccess } = require('../../src/utils/lovable-transformer/repository-access');

// Example repository with a checkbox component from Lovable
const LOVABLE_REPO = 'https://github.com/lovable-ui/checkbox-4dd41.git';
const LOCAL_PATH = path.join(process.cwd(), 'tmp/lovable-checkbox');

/**
 * Analyze a component for values that can be converted to tokens
 */
async function analyzeComponent(componentFiles) {
  const analysis = {
    colors: new Set(),
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
    borderRadii: [...analysis.borderRadii],
    shadows: [...analysis.shadows],
    tailwindClasses: analysis.tailwindClasses
  };
}

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

  return classes;
}

/**
 * Clean up temporary repository
 */
async function cleanupRepository(repoPath) {
  try {
    console.log(`\nCleaning up repository at ${repoPath}...`);
    await fs.rm(repoPath, { recursive: true, force: true });
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

/**
 * Main function
 */
async function main(cleanup = false) {
  try {
    console.log('Testing Lovable Component Analysis');
    console.log('=================================');
    
    // Set up repository access
    const repoAccess = new LocalCloneAccess({
      repoUrl: LOVABLE_REPO,
      localPath: LOCAL_PATH,
      branch: 'main',
      componentPattern: 'src/components/{componentName}'
    });

    // Clone and set up the repository
    console.log('\nSetting up repository...');
    await repoAccess.setup();
    
    // List components
    console.log('\nListing components...');
    const components = await repoAccess.listComponents();
    console.log('Available components:');
    components.forEach(component => console.log(`- ${component}`));
    
    // Get and analyze each component
    for (const componentName of components) {
      console.log(`\nAnalyzing component: ${componentName}`);
      
      // Get component files
      const files = await repoAccess.getComponentFiles(componentName);
      console.log(`Component has ${files.length} files`);
      
      // Analyze component
      const analysis = await analyzeComponent(files);
      
      // Display analysis results
      console.log('\nAnalysis Results:');
      console.log('Colors:');
      analysis.colors.forEach(color => console.log(`- ${color}`));
      
      console.log('\nBorder Radii:');
      analysis.borderRadii.forEach(radius => console.log(`- ${radius}`));
      
      console.log('\nShadows:');
      analysis.shadows.forEach(shadow => console.log(`- ${shadow}`));
      
      console.log('\nTailwind Classes:');
      const tailwindCategories = categorizeClasses(analysis.tailwindClasses);
      Object.entries(tailwindCategories).forEach(([category, classes]) => {
        console.log(`- ${category}: ${classes.join(', ')}`);
      });
    }
    
    console.log('\nComponent analysis completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (cleanup) {
      await cleanupRepository(LOCAL_PATH);
    } else {
      console.log('\nSkipping cleanup. Repository remains at:', LOCAL_PATH);
    }
  }
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
    if (cls.startsWith('text-') || cls.startsWith('bg-') || cls.startsWith('border-')) {
      categories.color.push(cls);
    } else if (cls.startsWith('p-') || cls.startsWith('m-') || cls.startsWith('gap-')) {
      categories.spacing.push(cls);
    } else if (cls.startsWith('font-') || cls.startsWith('text-') || cls.startsWith('leading-')) {
      categories.typography.push(cls);
    } else if (cls.startsWith('flex') || cls.startsWith('grid') || cls.startsWith('justify-')) {
      categories.layout.push(cls);
    } else {
      categories.other.push(cls);
    }
  }
  
  return categories;
}

// Check if cleanup flag is passed
const shouldCleanup = process.argv.includes('--cleanup');

// Run the test
main(shouldCleanup);