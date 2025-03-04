#!/usr/bin/env node

/**
 * Simple script to test the component analyzer
 */

const path = require('path');
const { LocalCloneAccess } = require('../../src/utils/lovable-transformer/repository-access/local-clone');
const { 
  analyzeComponent,
  categorizeClasses 
} = require('../../src/utils/lovable-transformer/component-analyzer');

// Example repository with a Lovable component
const LOVABLE_REPO = 'https://github.com/Widoba/p-941299.git';
const LOCAL_PATH = path.join(process.cwd(), 'tmp/lovable-component');

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
      componentPattern: 'src/{componentName}'
    });

    // Clone and set up the repository
    console.log('\nSetting up repository...');
    await repoAccess.setup();
    
    // List components
    console.log('\nListing components...');
    const components = await repoAccess.listComponents();
    console.log('Available components:');
    components.forEach(component => console.log(`- ${component}`));
    
    // Get and analyze a component
    if (components.length > 0) {
      const componentName = components[0];
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
        if (classes.length > 0) {
          console.log(`- ${category}: ${classes.join(', ')}`);
        }
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
 * Clean up temporary repository
 */
async function cleanupRepository(repoPath) {
  try {
    console.log(`\nCleaning up repository at ${repoPath}...`);
    const fs = require('fs/promises');
    await fs.rm(repoPath, { recursive: true, force: true });
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

// Check if cleanup flag is passed
const shouldCleanup = process.argv.includes('--cleanup');

// Run the test
main(shouldCleanup);