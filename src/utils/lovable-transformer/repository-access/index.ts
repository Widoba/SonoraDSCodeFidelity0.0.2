// Export all types
export * from './types';

// Export implementations
export { LocalCloneAccess } from './local-clone';
export { GitHubAPIAccess } from './github-api';

// Factory function to create repository access
export const createRepositoryAccess = async (
  type: 'github-api' | 'local-clone',
  config: any
) => {
  if (type === 'github-api') {
    const { GitHubAPIAccess } = await import('./github-api');
    const access = new GitHubAPIAccess(config);
    await access.setup();
    return access;
  } else {
    const { LocalCloneAccess } = await import('./local-clone');
    const access = new LocalCloneAccess(config);
    await access.setup();
    return access;
  }
};