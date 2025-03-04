#!/usr/bin/env node

// Import dependencies
import * as path from 'path';
import { program } from 'commander';
import { handleCLI } from '../../src/utils/lovable-transformer/cli';
import { analyzeComponent, categorizeClasses } from '../../src/utils/lovable-transformer/component-analyzer';

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
      const cliOptions = {
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
          format: options.format
        }
      };
      
      const result = await handleCLI(cliOptions);
      
      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error: any) {
      console.error('Error:', error.message || String(error));
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
      const cliOptions = {
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
          format: options.format
        }
      };
      
      const result = await handleCLI(cliOptions);
      
      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error: any) {
      console.error('Error:', error.message || String(error));
      process.exit(1);
    }
  });

// Add analyze command
program
  .command('analyze')
  .description('Analyze component for token conversion')
  .requiredOption('-n, --name <n>', 'Component name')
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
      const cliOptions = {
        command: 'show', // Reuse the show command to get component files
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
          format: 'json' // We need the raw data
        }
      };
      
      // Get component files
      const component = await handleCLI(cliOptions);
      
      // Analyze the component
      const analysis = await analyzeComponent(component.files);
      
      // Categorize Tailwind classes
      const categorized = categorizeClasses(analysis.tailwindClasses);
      
      // Format and display the results
      if (options.format === 'json') {
        console.log(JSON.stringify({
          ...analysis,
          tailwindCategories: categorized
        }, null, 2));
      } else {
        console.log(`\nAnalysis for component: ${options.name}`);
        console.log('========================================');
        
        console.log('\nColors:');
        analysis.colors.forEach(color => console.log(`- ${color}`));
        
        console.log('\nBorder Radii:');
        analysis.borderRadii.forEach(radius => console.log(`- ${radius}`));
        
        console.log('\nShadows:');
        analysis.shadows.forEach(shadow => console.log(`- ${shadow}`));
        
        console.log('\nTailwind Classes:');
        Object.entries(categorized).forEach(([category, classes]) => {
          if (classes.length > 0) {
            console.log(`- ${category}: ${classes.join(', ')}`);
          }
        });
      }
    } catch (error: any) {
      console.error('Error:', error.message || String(error));
      process.exit(1);
    }
  });

// Add transform command
program
  .command('transform')
  .description('Transform component to use design tokens')
  .requiredOption('-n, --name <n>', 'Component name')
  .option('-g, --github', 'Use GitHub API for repository access')
  .option('-o, --owner <owner>', 'GitHub repository owner (for GitHub API)')
  .option('-r, --repo <repo>', 'GitHub repository name (for GitHub API)')
  .option('--ref <ref>', 'GitHub reference (branch, tag, or commit SHA)')
  .option('--auth <token>', 'GitHub authentication token')
  .option('-u, --url <url>', 'Git repository URL (for local clone)')
  .option('-p, --path <path>', 'Local path to clone repository (for local clone)')
  .option('-b, --branch <branch>', 'Git branch to use (for local clone)')
  .option('-c, --component-pattern <pattern>', 'Pattern for component directories', 'src/components/{componentName}')
  .option('-d, --output-dir <dir>', 'Directory to save transformed files', './tmp/transformed')
  .option('-f, --format <format>', 'Output format (json or text)', 'text')
  .action(async (options) => {
    try {
      const cliOptions = {
        command: 'transform',
        sourceType: options.github ? 'github-api' : 'local-clone',
        component: options.name,
        outputDir: options.outputDir,
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
          format: options.format
        }
      };
      
      const result = await handleCLI(cliOptions);
      
      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error: any) {
      console.error('Error:', error.message || String(error));
      process.exit(1);
    }
  });

// Add checkbox command for easy testing with our sample
program
  .command('transform-checkbox')
  .description('Transform the example Lovable checkbox component')
  .option('-d, --debug', 'Show debug information')
  .action(async (options) => {
    try {
      console.log('Running checkbox component transformer...');
      
      // Uses the main CLI command for transformation
      const { execSync } = require('child_process');
      const cmd = 'ts-node scripts/cli/lovable-transformer.ts transform -n checkbox -p ./tmp/checkbox-component -c src/components/checkbox -d ./tmp/transformed-checkbox';
      
      try {
        const result = execSync(cmd).toString();
        if (options.debug) {
          console.log(result);
        } else {
          console.log('Checkbox component transformed successfully!');
          console.log('Transformed files saved to: ./tmp/transformed-checkbox/checkbox');
        }
      } catch (err) {
        console.error('Error running TypeScript CLI. Falling back to standalone script...');
        const result = execSync('node scripts/cli/transform-checkbox.js').toString();
        if (options.debug) {
          console.log(result);
        } else {
          console.log('Checkbox component transformed using standalone script!');
          console.log('Transformed files saved to: tmp/transformed-checkbox');
        }
      }
    } catch (error: any) {
      console.error('Error:', error.message || String(error));
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();