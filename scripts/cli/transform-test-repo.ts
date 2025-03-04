#!/usr/bin/env ts-node

/**
 * Test script to transform components from the test repository
 */

import path from 'path';
import fs from 'fs';
import { transformComponent } from '../../src/utils/lovable-transformer/component-transformer';
import { analyzeComponent } from '../../src/utils/lovable-transformer/component-analyzer';

// Path to the test repository
const TEST_REPO_PATH = path.resolve(__dirname, '../../tmp/p-562375');

// Component paths to transform
const COMPONENTS_TO_TRANSFORM = [
  'src/components/design-system/TypographyExamples.tsx',
  'src/components/design-system/ColorPalette.tsx'
];

async function main() {
  console.log('=== Starting Test Repository Transformation ===');
  console.log(`Test repository: ${TEST_REPO_PATH}`);
  
  // Check if the test repository exists
  if (!fs.existsSync(TEST_REPO_PATH)) {
    console.error(`Error: Test repository does not exist at ${TEST_REPO_PATH}`);
    process.exit(1);
  }
  
  // Transform each component
  for (const componentPath of COMPONENTS_TO_TRANSFORM) {
    const fullPath = path.join(TEST_REPO_PATH, componentPath);
    
    console.log(`\nTransforming component: ${componentPath}`);
    
    // Check if the component file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: Component file does not exist at ${fullPath}`);
      continue;
    }
    
    // Read the component file
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Create component file object
    const componentFile = {
      name: path.basename(fullPath),
      path: fullPath,
      content
    };
    
    // Analyze the component
    console.log('Analyzing component...');
    const analysis = await analyzeComponent([componentFile]);
    
    // Transform the component
    console.log('Transforming component...');
    const result = await transformComponent([componentFile], analysis);
    
    // Print transformation summary
    console.log('\nTransformation summary:');
    console.log(`- Colors transformed: ${result.summary.colorsTransformed}`);
    console.log(`- Border radii transformed: ${result.summary.borderRadiiTransformed}`);
    console.log(`- Shadows transformed: ${result.summary.shadowsTransformed}`);
    console.log(`- Typography transformed: ${result.summary.typographyTransformed}`);
    console.log(`- Tailwind classes transformed: ${result.summary.tailwindClassesTransformed}`);
    
    // Write the transformed component to a new file
    const outputPath = fullPath.replace('.tsx', '.transformed.tsx');
    fs.writeFileSync(outputPath, result.transformedFiles[0].content);
    
    console.log(`Transformed component written to: ${outputPath}`);
  }
  
  console.log('\n=== Transformation Complete ===');
}

main().catch(error => {
  console.error('Error during transformation:', error);
  process.exit(1);
});