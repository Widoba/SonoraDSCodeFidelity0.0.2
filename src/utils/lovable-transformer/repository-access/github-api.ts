import { RepositoryAccess, GitHubConfig, ComponentFile } from './types';

// Define Octokit types without requiring the library, so we don't need to
// install it during the initial phase if not needed
interface OctokitResponse<T> {
  data: T;
}

interface OctokitContent {
  name: string;
  path: string;
  type: string;
  content?: string;
  encoding?: string;
}

/**
 * Repository access implementation using GitHub API
 */
export class GitHubAPIAccess implements RepositoryAccess {
  private config: GitHubConfig;
  private octokit: any; // Will be Octokit instance
  
  constructor(config: GitHubConfig) {
    this.config = {
      ref: 'main',
      ...config
    };
  }
  
  /**
   * Set up the repository access (initialize Octokit)
   */
  async setup(): Promise<void> {
    try {
      // Dynamically import Octokit to avoid requiring it for users who don't need GitHub API access
      const { Octokit } = await import('@octokit/rest');
      
      this.octokit = new Octokit({
        auth: this.config.auth
      });
      
      console.log(`GitHub API initialized for ${this.config.owner}/${this.config.repo}`);
    } catch (error) {
      console.error('Error setting up GitHub API:', error);
      throw new Error(
        `Failed to initialize GitHub API. Make sure @octokit/rest is installed: npm install @octokit/rest\n` +
        `Original error: ${error.message}`
      );
    }
  }
  
  /**
   * List all components in the repository
   */
  async listComponents(): Promise<string[]> {
    try {
      // Parse the component pattern to determine the directory to search
      const { componentDir } = this.parseComponentPattern();
      
      // Get contents of the components directory
      const response: OctokitResponse<OctokitContent[]> = await this.octokit.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: componentDir,
        ref: this.config.ref
      });
      
      // Filter directories (components)
      const components = response.data
        .filter(item => item.type === 'dir')
        .map(item => item.name);
      
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
      const componentPath = `${componentDir}/${componentName}`;
      
      // Get all files in the component directory (recursively)
      const allFiles = await this.getRepositoryContent(componentPath);
      
      // Filter and process component files
      const componentFiles: ComponentFile[] = allFiles
        .filter(file => 
          file.name.endsWith('.ts') || 
          file.name.endsWith('.tsx') || 
          file.name.endsWith('.js') || 
          file.name.endsWith('.jsx')
        )
        .map(file => ({
          name: file.name,
          path: file.path,
          content: Buffer.from(file.content, 'base64').toString('utf-8')
        }));
      
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
   * Get all content in a repository path recursively
   */
  private async getRepositoryContent(path: string): Promise<OctokitContent[]> {
    try {
      const response: OctokitResponse<OctokitContent | OctokitContent[]> = await this.octokit.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        ref: this.config.ref
      });
      
      // If it's a single file, return it
      if (!Array.isArray(response.data)) {
        return [response.data as OctokitContent];
      }
      
      // For each directory, get its contents recursively
      const contents = await Promise.all(
        response.data.map(async (item) => {
          if (item.type === 'dir') {
            return this.getRepositoryContent(item.path);
          }
          return [item];
        })
      );
      
      // Flatten the results
      return contents.flat();
    } catch (error) {
      console.error(`Error getting repository content for ${path}:`, error);
      throw error;
    }
  }
}