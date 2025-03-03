import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { RepositoryAccess, LocalCloneConfig, ComponentFile } from './types';

// Convert exec to Promise-based
const execAsync = util.promisify(exec);

/**
 * Repository access implementation using local git clone
 */
export class LocalCloneAccess implements RepositoryAccess {
  private config: LocalCloneConfig;
  
  constructor(config: LocalCloneConfig) {
    this.config = {
      branch: 'main',
      ...config
    };
  }
  
  /**
   * Set up the repository (clone or update)
   */
  async setup(): Promise<void> {
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
  async listComponents(): Promise<string[]> {
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
  async getComponentFiles(componentName: string): Promise<ComponentFile[]> {
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
      const componentFiles: ComponentFile[] = await Promise.all(
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
  private parseComponentPattern(): { componentDir: string; componentNamePattern: string } {
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
  private async getFilesRecursively(dir: string): Promise<string[]> {
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