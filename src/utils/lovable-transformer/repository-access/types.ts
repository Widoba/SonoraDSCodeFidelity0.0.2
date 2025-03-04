/**
 * Interface for component file
 */
export interface ComponentFile {
  /**
   * File name
   */
  name: string;
  
  /**
   * Relative path to the file
   */
  path: string;
  
  /**
   * File content
   */
  content: string;
}

/**
 * Interface for repository access
 */
export interface RepositoryAccess {
  setup(): Promise<void>;
  listComponents(): Promise<string[]>;
  getComponentFiles(componentName: string): Promise<ComponentFile[]>;
}

/**
 * Common configuration for repository access
 */
export interface RepositoryConfig {
  componentPattern: string;
}

/**
 * Configuration for local clone access
 */
export interface LocalCloneConfig extends RepositoryConfig {
  repoUrl: string;
  localPath: string;
  branch?: string;
}

/**
 * Configuration for GitHub API access
 */
export interface GitHubConfig extends RepositoryConfig {
  owner: string;
  repo: string;
  ref?: string;
  auth?: string;
}

// Export default for CommonJS compatibility
export default {
  ComponentFile,
  RepositoryAccess,
  RepositoryConfig,
  LocalCloneConfig,
  GitHubConfig
};