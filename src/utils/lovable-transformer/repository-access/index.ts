// Not using import/export syntax for better compatibility with the CLI tool
const types = require('./types');
const { LocalCloneAccess } = require('./local-clone');
const { GitHubAPIAccess } = require('./github-api');

// Factory function to create repository access
async function createRepositoryAccess(type, config) {
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

// Export everything
module.exports = {
  ...types,
  LocalCloneAccess,
  GitHubAPIAccess,
  createRepositoryAccess
};