#!/usr/bin/env node
import path from 'path';
import { program } from 'commander';
import { handleCLI } from '../../src/utils/lovable-transformer/cli';
import type { CLIOptions } from '../../src/utils/lovable-transformer/cli/types';

// Set up the CLI program
program
  .name('lovable-transformer')
  .description('Transform Lovable components to use design tokens')
  .version('0.1.0');

// Add list command
program
  .command('list')
  .description('List available components')
  .option('-g, --github', 'Use GitHub API for repository access')
  .option('-o, --owner <owner>', 'GitHub repository owner (for GitHub API)')
  .option('-r, --repo <repo>', 'GitHub repository name (for GitHub API)')
  .option('--ref <ref>', 'GitHub reference (branch, tag, or commit SHA)')
  .option('--auth <token>', 'GitHub authentication token')
  .option('-u, --url <url>', 'Git repository URL (for local clone)')
  .option('-p, --path <path>', 'Local path to clone repository (for local clone)')
  .option('-b, --branch <branch>', 'Git branch to use (for local clone)')
  .option('-c, --component-pattern <pattern>', 'Pattern for component directories', 'src/components/{componentName}')
  .option('-f, --format <format>', 'Output format (json or text)', 'text')
  .action(async (options) => {
    try {
      const cliOptions: CLIOptions = {
        command: 'list',
        sourceType: options.github ? 'github-api' : 'local-clone',
        repo: {
          owner: options.owner,
          repo: options.repo,
          ref: options.ref,
          auth: options.auth,
          repoUrl: options.url,
          localPath: options.path || path.join(process.cwd(), 'tmp/lovable-repo'),
          branch: options.branch,
          componentPattern: options.componentPattern
        },
        output: {
          format: options.format as 'json' | 'text'
        }
      };
      
      const result = await handleCLI(cliOptions);
      
      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Add show command
program
  .command('show')
  .description('Show component details')
  .requiredOption('-n, --name <name>', 'Component name')
  .option('-g, --github', 'Use GitHub API for repository access')
  .option('-o, --owner <owner>', 'GitHub repository owner (for GitHub API)')
  .option('-r, --repo <repo>', 'GitHub repository name (for GitHub API)')
  .option('--ref <ref>', 'GitHub reference (branch, tag, or commit SHA)')
  .option('--auth <token>', 'GitHub authentication token')
  .option('-u, --url <url>', 'Git repository URL (for local clone)')
  .option('-p, --path <path>', 'Local path to clone repository (for local clone)')
  .option('-b, --branch <branch>', 'Git branch to use (for local clone)')
  .option('-c, --component-pattern <pattern>', 'Pattern for component directories', 'src/components/{componentName}')
  .option('-f, --format <format>', 'Output format (json or text)', 'text')
  .action(async (options) => {
    try {
      const cliOptions: CLIOptions = {
        command: 'show',
        sourceType: options.github ? 'github-api' : 'local-clone',
        component: options.name,
        repo: {
          owner: options.owner,
          repo: options.repo,
          ref: options.ref,
          auth: options.auth,
          repoUrl: options.url,
          localPath: options.path || path.join(process.cwd(), 'tmp/lovable-repo'),
          branch: options.branch,
          componentPattern: options.componentPattern
        },
        output: {
          format: options.format as 'json' | 'text'
        }
      };
      
      const result = await handleCLI(cliOptions);
      
      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();