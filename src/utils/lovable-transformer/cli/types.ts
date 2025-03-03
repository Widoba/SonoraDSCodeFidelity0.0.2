/**
 * CLI options for the Lovable transformer
 */
export interface CLIOptions {
  /**
   * Command to execute
   */
  command: 'list' | 'show' | 'analyze' | 'transform';
  
  /**
   * Source type
   */
  sourceType: 'github-api' | 'local-clone';
  
  /**
   * Component name
   */
  component?: string;
  
  /**
   * Whether to process all components
   */
  all?: boolean;
  
  /**
   * Repository configuration
   */
  repo: {
    // For GitHub API
    owner?: string;
    repo?: string;
    ref?: string;
    auth?: string;
    
    // For local clone
    repoUrl?: string;
    localPath?: string;
    branch?: string;
    
    // Common
    componentPattern: string;
  };
  
  /**
   * Transform options
   */
  transform?: {
    /**
     * Whether to skip unknown values
     */
    skipUnknownValues?: boolean;
  };
  
  /**
   * Output options
   */
  output?: {
    /**
     * Format of the output
     */
    format?: 'json' | 'text';
    
    /**
     * Path to save output
     */
    path?: string;
  };
}