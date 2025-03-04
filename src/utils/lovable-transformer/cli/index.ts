import { createRepositoryAccess } from '../repository-access';

/**
 * Handle CLI options to execute the lovable transformer
 */
export async function handleCLI(options) {
  try {
    // Create repository access
    const repoConfig = options.sourceType === 'github-api'
      ? {
          owner: options.repo.owner,
          repo: options.repo.repo,
          ref: options.repo.ref,
          auth: options.repo.auth,
          componentPattern: options.repo.componentPattern
        }
      : {
          repoUrl: options.repo.repoUrl,
          localPath: options.repo.localPath,
          branch: options.repo.branch,
          componentPattern: options.repo.componentPattern
        };
        
    const repoAccess = await createRepositoryAccess(options.sourceType, repoConfig);
    
    // Execute command
    switch (options.command) {
      case 'list':
        return await handleList(repoAccess);
        
      case 'show':
        if (!options.component) {
          throw new Error('Component name is required for show command');
        }
        return await handleShow(repoAccess, options.component);
        
      case 'analyze':
        if (!options.component) {
          throw new Error('Component name is required for analyze command');
        }
        // First get the component files
        const component = await handleShow(repoAccess, options.component);
        // Analysis will be handled by the caller
        return component;
      
      case 'transform':
        if (!options.component) {
          throw new Error('Component name is required for transform command');
        }
        if (!options.outputDir) {
          throw new Error('Output directory is required for transform command');
        }
        return await handleTransform(repoAccess, options.component, options.outputDir);
        
      default:
        throw new Error(`Command not implemented yet: ${options.command}`);
    }
  } catch (error) {
    console.error('Error handling CLI:', error);
    throw error;
  }
}

/**
 * Handle list command
 */
async function handleList(repoAccess: any) {
  try {
    const components = await repoAccess.listComponents();
    
    console.log('Available components:');
    components.forEach(component => console.log(`- ${component}`));
    
    return components;
  } catch (error) {
    console.error('Error listing components:', error);
    throw error;
  }
}

/**
 * Handle show command
 */
async function handleShow(repoAccess: any, componentName: string) {
  try {
    const files = await repoAccess.getComponentFiles(componentName);
    
    console.log(`Component: ${componentName}`);
    console.log(`Files:`);
    
    files.forEach(file => {
      console.log(`- ${file.path}`);
      // Limit content preview to first 5 lines
      const contentLines = file.content.split('\n').slice(0, 5);
      console.log('  Preview:');
      contentLines.forEach(line => console.log(`    ${line}`));
      console.log('  ...');
    });
    
    return {
      name: componentName,
      files
    };
  } catch (error) {
    console.error(`Error showing component ${componentName}:`, error);
    throw error;
  }
}

// Export functions as default as well for CommonJS compatibility
/**
 * Handle transform command
 */
async function handleTransform(repoAccess: any, componentName: string, outputDir: string) {
  try {
    // Import needed modules
    const fs = require('fs/promises');
    const path = require('path');
    const { analyzeComponent } = require('../component-analyzer');
    const { transformComponent } = require('../component-transformer');
    
    console.log(`Transforming component: ${componentName}`);
    
    // Get component files
    const files = await repoAccess.getComponentFiles(componentName);
    console.log(`Component has ${files.length} files`);
    
    // Analyze component
    console.log('Analyzing component...');
    const analysis = await analyzeComponent(files);
    
    // Transform component
    console.log('Transforming component...');
    const transformResult = await transformComponent(files, analysis);
    
    // Create output directory
    const componentOutputDir = path.join(outputDir, componentName);
    await fs.mkdir(componentOutputDir, { recursive: true });
    
    // Write transformed files
    let savedFiles = 0;
    for (const file of transformResult.transformedFiles) {
      const outputPath = path.join(componentOutputDir, file.name);
      await fs.writeFile(outputPath, file.content);
      console.log(`Saved: ${outputPath}`);
      savedFiles++;
    }
    
    // Display transformation summary
    const summary = {
      componentName,
      originalFiles: files.length,
      transformedFiles: savedFiles,
      colorsTransformed: transformResult.summary.colorsTransformed,
      borderRadiiTransformed: transformResult.summary.borderRadiiTransformed,
      shadowsTransformed: transformResult.summary.shadowsTransformed,
      tailwindClassesTransformed: transformResult.summary.tailwindClassesTransformed,
      outputDir: componentOutputDir
    };
    
    console.log('\nTransformation Summary:');
    console.log(`- Colors Transformed: ${summary.colorsTransformed}`);
    console.log(`- Border Radii Transformed: ${summary.borderRadiiTransformed}`);
    console.log(`- Shadows Transformed: ${summary.shadowsTransformed}`);
    console.log(`- Tailwind Classes Transformed: ${summary.tailwindClassesTransformed}`);
    console.log(`\nTransformed files saved to: ${componentOutputDir}`);
    
    return summary;
  } catch (error) {
    console.error(`Error transforming component ${componentName}:`, error);
    throw error;
  }
}

export default {
  handleCLI
};