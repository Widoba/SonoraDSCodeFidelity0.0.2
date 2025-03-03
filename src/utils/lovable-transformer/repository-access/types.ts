/**
 * Interface for component file
 */
const ComponentFile = {}; // This is just for JSDoc, actual implementation is not type-checked in CommonJS

/**
 * Interface for repository access
 */
const RepositoryAccess = {};

/**
 * Common configuration for repository access
 */
const RepositoryConfig = {};

/**
 * Configuration for local clone access
 */
const LocalCloneConfig = {};

/**
 * Configuration for GitHub API access
 */
const GitHubConfig = {};

// Export types
module.exports = {
  ComponentFile,
  RepositoryAccess,
  RepositoryConfig,
  LocalCloneConfig,
  GitHubConfig
};