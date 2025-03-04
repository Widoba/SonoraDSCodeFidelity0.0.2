import { ComponentFile } from './types';
import { LocalCloneAccess } from './local-clone';
import { GitHubAPIAccess } from './github-api';

export { ComponentFile, LocalCloneAccess, GitHubAPIAccess };

// Factory function to create repository access
export async function createRepositoryAccess(type: string, config: any) {
  if (type === 'github-api') {
    const access = new GitHubAPIAccess(config);
    await access.setup();
    return access;
  } else {
    const access = new LocalCloneAccess(config);
    await access.setup();
    return access;
  }
}

// Export default for CommonJS compatibility
export default {
  ComponentFile,
  LocalCloneAccess,
  GitHubAPIAccess,
  createRepositoryAccess
};