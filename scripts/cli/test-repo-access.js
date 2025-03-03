#!/usr/bin/env node

/**
 * This is a simplified test script for the repository access functionality
 */

const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

// Convert exec to Promise-based
const execAsync = util.promisify(exec);

/**
 * Repository access implementation using local git clone
 */
class LocalCloneAccess {
  constructor(config) {
    this.config = {
      branch: 'main',
      ...config
    };
  }
  
  /**
   * Set up the repository (clone or update)
   */
  async setup() {
    try {
      // Check if repository exists locally
      const repoExists = await fs.access(this.config.localPath)
        .then(() => true)
        .catch(() => false);
      
      if (repoExists) {
        // Check if it's a git repository
        const isGitRepo = await fs.access(path.join(this.config.localPath, '.git'))
          .then(() => true)
          .catch(() => false);
        
        if (!isGitRepo) {
          throw new Error(`Path exists but is not a git repository: ${this.config.localPath}`);
        }
        
        // Update existing repository
        console.log(`Updating repository at ${this.config.localPath}...`);
        
        const { stdout } = await execAsync(`
          cd "${this.config.localPath}" && 
          git fetch origin && 
          git checkout ${this.config.branch} && 
          git pull origin ${this.config.branch}
        `);
        
        console.log(`Repository updated: ${stdout}`);
      } else {
        // Clone repository
        console.log(`Cloning repository to ${this.config.localPath}...`);
        
        await fs.mkdir(this.config.localPath, { recursive: true });
        
        const { stdout } = await execAsync(`
          git clone --branch ${this.config.branch} ${this.config.repoUrl} "${this.config.localPath}"
        `);
        
        console.log(`Repository cloned: ${stdout}`);
      }
    } catch (error) {
      console.error('Error setting up repository:', error);
      throw error;
    }
  }
  
  /**
   * List all components in the repository
   */
  async listComponents() {
    try {
      // Parse the component pattern to determine the directory to search
      const { componentDir, componentNamePattern } = this.parseComponentPattern();
      const fullComponentDir = path.join(this.config.localPath, componentDir);
      
      // Check if directory exists
      const dirExists = await fs.access(fullComponentDir)
        .then(() => true)
        .catch(() => false);
      
      if (!dirExists) {
        throw new Error(`Component directory does not exist: ${fullComponentDir}`);
      }
      
      // Get all directories in the component directory
      const entries = await fs.readdir(fullComponentDir, { withFileTypes: true });
      
      // Filter directories
      const components = entries
        .filter(entry => entry.isDirectory())
        .map(dir => dir.name);
      
      return components;
    } catch (error) {
      console.error('Error listing components:', error);
      throw error;
    }
  }
  
  /**
   * Get files for a specific component
   */
  async getComponentFiles(componentName) {
    try {
      // Parse the component pattern to determine the component directory
      const { componentDir } = this.parseComponentPattern();
      const componentFullPath = path.join(
        this.config.localPath, 
        componentDir, 
        componentName
      );
      
      // Check if component directory exists
      const dirExists = await fs.access(componentFullPath)
        .then(() => true)
        .catch(() => false);
      
      if (!dirExists) {
        throw new Error(`Component directory does not exist: ${componentFullPath}`);
      }
      
      // Get all files in the component directory (recursively)
      const files = await this.getFilesRecursively(componentFullPath);
      
      // Filter and process component files
      const componentFiles = await Promise.all(
        files
          .filter(file => file.endsWith('.ts') || 
                         file.endsWith('.tsx') || 
                         file.endsWith('.js') || 
                         file.endsWith('.jsx'))
          .map(async (filePath) => {
            const relativePath = path.relative(this.config.localPath, filePath);
            const content = await fs.readFile(filePath, 'utf-8');
            
            return {
              name: path.basename(filePath),
              path: relativePath,
              content
            };
          })
      );
      
      return componentFiles;
    } catch (error) {
      console.error(`Error getting component files for ${componentName}:`, error);
      throw error;
    }
  }
  
  /**
   * Parse component pattern to extract directory and pattern
   */
  parseComponentPattern() {
    // Default pattern: src/components/{componentName}
    const pattern = this.config.componentPattern || 'src/components/{componentName}';
    
    // Extract the directory part (before {componentName})
    const componentNamePlaceholder = '{componentName}';
    const placeholderIndex = pattern.indexOf(componentNamePlaceholder);
    
    if (placeholderIndex === -1) {
      throw new Error(`Invalid component pattern: ${pattern}. Must include {componentName}`);
    }
    
    const componentDir = pattern.substring(0, placeholderIndex);
    const componentNamePattern = pattern.substring(placeholderIndex + componentNamePlaceholder.length);
    
    return {
      componentDir: componentDir.replace(/\/+$/, ''), // Remove trailing slashes
      componentNamePattern
    };
  }
  
  /**
   * Get all files in a directory recursively
   */
  async getFilesRecursively(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          return this.getFilesRecursively(fullPath);
        }
        
        return [fullPath];
      })
    );
    
    return files.flat();
  }
}

/**
 * Clean up temporary repository
 */
async function cleanupRepository(repoPath) {
  try {
    console.log(`\nCleaning up repository at ${repoPath}...`);
    // Use fs.rm with recursive option (Node.js v14.14.0+)
    await fs.rm(repoPath, { recursive: true, force: true });
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

/**
 * Test function
 */
async function testLocalClone(cleanup = false) {
  const repoPath = path.join(process.cwd(), 'tmp/test-repo');
  
  try {
    const repoAccess = new LocalCloneAccess({
      repoUrl: 'https://github.com/facebook/react.git',
      localPath: repoPath,
      branch: 'main',
      componentPattern: 'packages/{componentName}'
    });
    
    // Set up the repository
    console.log('Setting up repository...');
    await repoAccess.setup();
    
    // List components
    console.log('Listing components...');
    const components = await repoAccess.listComponents();
    console.log('Available components:');
    components.slice(0, 5).forEach(component => console.log(`- ${component}`));
    console.log(`...and ${components.length - 5} more`);
    
    // Get files for a component
    if (components.length > 0) {
      const componentName = components[0];
      console.log(`\nGetting files for component: ${componentName}`);
      const files = await repoAccess.getComponentFiles(componentName);
      console.log(`Found ${files.length} files. First 3 files:`);
      files.slice(0, 3).forEach(file => {
        console.log(`- ${file.path}`);
        // Show first 3 lines of each file
        const contentPreview = file.content.split('\n').slice(0, 3).join('\n');
        console.log(`  Preview:\n${contentPreview}\n  ...`);
      });
    }
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Clean up if requested
    if (cleanup) {
      await cleanupRepository(repoPath);
    } else {
      console.log('\nSkipping cleanup. Repository remains at:', repoPath);
      console.log('To clean up manually, run: rm -rf', repoPath);
    }
  }
}

// Check if cleanup flag is passed
const shouldCleanup = process.argv.includes('--cleanup');

// Run the test
testLocalClone(shouldCleanup);