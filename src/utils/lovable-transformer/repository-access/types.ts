/**
 * Interface for component file
 */
export interface ComponentFile {
  name: string;
  content: string;
  path: string;
}

/**
 * Interface for repository access
 */
export interface RepositoryAccess {
  /**
   * Set up the repository (clone or initialize API)
   */
  setup(): Promise<void>;
  
  /**
   * List all components in the repository
   */
  listComponents(): Promise<string[]>;
  
  /**
   * Get files for a specific component
   * @param componentName Name of the component
   */
  getComponentFiles(componentName: string): Promise<ComponentFile[]>;
}

/**
 * Common configuration for repository access
 */
export interface RepositoryConfig {
  /**
   * Source pattern for component files
   * Typically src/components/{componentName}
   */
  componentPattern: string;
}

/**
 * Configuration for local clone access
 */
export interface LocalCloneConfig extends RepositoryConfig {
  /**
   * Git repository URL
   */
  repoUrl: string;
  
  /**
   * Local path to clone the repository
   */
  localPath: string;
  
  /**
   * Branch to checkout (default: main)
   */
  branch?: string;
}

/**
 * Configuration for GitHub API access
 */
export interface GitHubConfig extends RepositoryConfig {
  /**
   * Repository owner (username or organization)
   */
  owner: string;
  
  /**
   * Repository name
   */
  repo: string;
  
  /**
   * Branch, tag, or commit SHA (default: main)
   */
  ref?: string;
  
  /**
   * GitHub personal access token
   */
  auth?: string;
}