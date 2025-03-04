#!/usr/bin/env node

/**
 * Standalone script for analyzing Lovable components
 * All functionality in one file to avoid require issues
 */

const path = require('path');
const fs = require('fs/promises');
const util = require('util');
const { exec } = require('child_process');

// Convert exec to Promise-based
const execAsync = util.promisify(exec);

// Example repository with a Lovable component
const LOVABLE_REPO = 'https://github.com/Widoba/p-941299.git';
const LOCAL_PATH = path.join(process.cwd(), 'tmp/lovable-component');

/**
 * Repository access implementation using local git clone
 */
class LocalCloneAccess {
  constructor(config) {
    this.config = {
      branch: 'main',
      ...config
    };
  }
  
  /**
   * Set up the repository (clone or update)
   */
  async setup() {
    try {
      // Check if repository exists locally
      const repoExists = await fs.access(this.config.localPath)
        .then(() => true)
        .catch(() => false);
      
      if (repoExists) {
        // Check if it's a git repository
        const isGitRepo = await fs.access(path.join(this.config.localPath, '.git'))
          .then(() => true)
          .catch(() => false);
        
        if (!isGitRepo) {
          throw new Error(`Path exists but is not a git repository: ${this.config.localPath}`);
        }
        
        // Update existing repository
        console.log(`Updating repository at ${this.config.localPath}...`);
        
        const { stdout } = await execAsync(`
          cd "${this.config.localPath}" && 
          git fetch origin && 
          git checkout ${this.config.branch} && 
          git pull origin ${this.config.branch}
        `);
        
        console.log(`Repository updated`);
      } else {
        // Clone repository
        console.log(`Cloning repository to ${this.config.localPath}...`);
        
        await fs.mkdir(this.config.localPath, { recursive: true });
        
        const { stdout } = await execAsync(`
          git clone --branch ${this.config.branch} ${this.config.repoUrl} "${this.config.localPath}"
        `);
        
        console.log(`Repository cloned`);
      }
    } catch (error) {
      console.error('Error setting up repository:', error);
      throw error;
    }
  }
  
  /**
   * List all components in the repository
   */
  async listComponents() {
    try {
      // Parse the component pattern to determine the directory to search
      const { componentDir, componentNamePattern } = this.parseComponentPattern();
      const fullComponentDir = path.join(this.config.localPath, componentDir);
      
      // Check if directory exists
      const dirExists = await fs.access(fullComponentDir)
        .then(() => true)
        .catch(() => false);
      
      if (!dirExists) {
        throw new Error(`Component directory does not exist: ${fullComponentDir}`);
      }
      
      // Get all directories in the component directory
      const entries = await fs.readdir(fullComponentDir, { withFileTypes: true });
      
      // Filter directories
      const components = entries
        .filter(entry => entry.isDirectory())
        .map(dir => dir.name);
      
      return components;
    } catch (error) {
      console.error('Error listing components:', error);
      throw error;
    }
  }
  
  /**
   * Get files for a specific component
   */
  async getComponentFiles(componentName) {
    try {
      // Parse the component pattern to determine the component directory
      const { componentDir } = this.parseComponentPattern();
      const componentFullPath = path.join(
        this.config.localPath, 
        componentDir, 
        componentName
      );
      
      // Check if component directory exists
      const dirExists = await fs.access(componentFullPath)
        .then(() => true)
        .catch(() => false);
      
      if (!dirExists) {
        throw new Error(`Component directory does not exist: ${componentFullPath}`);
      }
      
      // Get all files in the component directory (recursively)
      const files = await this.getFilesRecursively(componentFullPath);
      
      // Filter and process component files
      const componentFiles = await Promise.all(
        files
          .filter(file => file.endsWith('.ts') || 
                         file.endsWith('.tsx') || 
                         file.endsWith('.js') || 
                         file.endsWith('.jsx'))
          .map(async (filePath) => {
            const relativePath = path.relative(this.config.localPath, filePath);
            const content = await fs.readFile(filePath, 'utf-8');
            
            return {
              name: path.basename(filePath),
              path: relativePath,
              content
            };
          })
      );
      
      return componentFiles;
    } catch (error) {
      console.error(`Error getting component files for ${componentName}:`, error);
      throw error;
    }
  }
  
  /**
   * Parse component pattern to extract directory and pattern
   */
  parseComponentPattern() {
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
   * Get all files in a directory recursively
   */
  async getFilesRecursively(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          return this.getFilesRecursively(fullPath);
        }
        
        return [fullPath];
      })
    );
    
    return files.flat();
  }
}

/**
 * Analyze a component for values that can be converted to tokens
 */
async function analyzeComponent(componentFiles) {
  const analysis = {
    colors: new Set(),
    borderRadii: new Set(),
    shadows: new Set(),
    tailwindClasses: []
  };

  // Extract all values from component files
  for (const file of componentFiles) {
    // Skip non-component files
    if (!file.name.endsWith('.tsx') && !file.name.endsWith('.jsx')) {
      continue;
    }

    console.log(`\nAnalyzing file: ${file.name}`);
    const content = file.content;

    // Extract color values (hex)
    const hexColors = extractHexColors(content);
    hexColors.forEach(color => analysis.colors.add(color));

    // Extract border-radius values
    const borderRadii = extractBorderRadii(content);
    borderRadii.forEach(radius => analysis.borderRadii.add(radius));

    // Extract shadow values
    const shadows = extractShadows(content);
    shadows.forEach(shadow => analysis.shadows.add(shadow));

    // Extract Tailwind classes
    const tailwindClasses = extractTailwindClasses(content);
    analysis.tailwindClasses = [
      ...analysis.tailwindClasses,
      ...tailwindClasses
    ];
  }

  return {
    colors: [...analysis.colors],
    borderRadii: [...analysis.borderRadii],
    shadows: [...analysis.shadows],
    tailwindClasses: analysis.tailwindClasses
  };
}

/**
 * Extract hex color values from code
 */
function extractHexColors(content) {
  // Match hex colors (#fff, #ffffff, etc.)
  const hexRegex = /#([0-9A-Fa-f]{3}){1,2}\b/g;
  const matches = content.match(hexRegex) || [];
  return matches;
}

/**
 * Extract border radius values from code
 */
function extractBorderRadii(content) {
  // Match border-radius CSS properties
  const cssRadiusRegex = /border-radius:\s*(\d+)px/g;
  const cssMatches = [];
  let match;
  
  while ((match = cssRadiusRegex.exec(content)) !== null) {
    cssMatches.push(`${match[1]}px`);
  }

  // Match Tailwind rounded classes with px values
  const twRadiusRegex = /rounded-\[(\d+)px\]/g;
  const twMatches = [];
  
  while ((match = twRadiusRegex.exec(content)) !== null) {
    twMatches.push(`${match[1]}px`);
  }

  // Also match standard Tailwind rounded classes
  const stdTwRadiusRegex = /rounded(-[a-z]+)*\b/g;
  while ((match = stdTwRadiusRegex.exec(content)) !== null) {
    if (!match[0].includes("rounded-[")) {
      twMatches.push(match[0]);
    }
  }

  return [...cssMatches, ...twMatches];
}

/**
 * Extract shadow values from code
 */
function extractShadows(content) {
  // Match box-shadow CSS properties
  const cssShadowRegex = /box-shadow:\s*([^;]+)/g;
  const cssMatches = [];
  let match;
  
  while ((match = cssShadowRegex.exec(content)) !== null) {
    cssMatches.push(match[1].trim());
  }

  // Match Tailwind shadow classes with values
  const twShadowRegex = /shadow-\[(.*?)\]/g;
  const twMatches = [];
  
  while ((match = twShadowRegex.exec(content)) !== null) {
    twMatches.push(match[1].trim());
  }

  // Also match standard Tailwind shadow classes
  const stdTwShadowRegex = /shadow(-[a-z]+)?\b/g;
  while ((match = stdTwShadowRegex.exec(content)) !== null) {
    if (!match[0].includes("shadow-[")) {
      twMatches.push(match[0]);
    }
  }

  return [...cssMatches, ...twMatches];
}

/**
 * Extract Tailwind classes from code
 */
function extractTailwindClasses(content) {
  // Match className attributes with Tailwind classes
  const classNameRegex = /className="([^"]+)"/g;
  const classes = [];
  let match;
  
  while ((match = classNameRegex.exec(content)) !== null) {
    // Split class string into individual classes
    const classNames = match[1].split(/\s+/);
    classes.push(...classNames);
  }

  // Also look for className with template literals
  const templateRegex = /className={`([^`]+)`}/g;
  while ((match = templateRegex.exec(content)) !== null) {
    // Split class string into individual classes
    const classNames = match[1].split(/\s+/);
    classes.push(...classNames);
  }

  return classes;
}

/**
 * Categorize Tailwind classes
 */
function categorizeClasses(classes) {
  const categories = {
    color: [],
    spacing: [],
    typography: [],
    layout: [],
    other: []
  };
  
  for (const cls of classes) {
    if (cls.startsWith('text-') && !cls.startsWith('text-sm') && !cls.startsWith('text-lg') || 
        cls.startsWith('bg-') || 
        cls.startsWith('border-') && !cls.startsWith('border-0') && !cls.startsWith('border-2')) {
      categories.color.push(cls);
    } else if (cls.startsWith('p-') || cls.startsWith('m-') || 
               cls.startsWith('px-') || cls.startsWith('py-') ||
               cls.startsWith('pt-') || cls.startsWith('pr-') ||
               cls.startsWith('pb-') || cls.startsWith('pl-') ||
               cls.startsWith('mx-') || cls.startsWith('my-') ||
               cls.startsWith('mt-') || cls.startsWith('mr-') ||
               cls.startsWith('mb-') || cls.startsWith('ml-') ||
               cls.startsWith('gap-')) {
      categories.spacing.push(cls);
    } else if (cls.startsWith('font-') || 
               cls.startsWith('text-') || 
               cls.startsWith('leading-') ||
               cls.startsWith('tracking-') ||
               cls.startsWith('align-')) {
      categories.typography.push(cls);
    } else if (cls.startsWith('flex') || 
               cls.startsWith('grid') || 
               cls.startsWith('justify-') ||
               cls.startsWith('items-') ||
               cls.startsWith('self-') ||
               cls.startsWith('col-') ||
               cls.startsWith('row-')) {
      categories.layout.push(cls);
    } else {
      categories.other.push(cls);
    }
  }
  
  return categories;
}

/**
 * Clean up temporary repository
 */
async function cleanupRepository(repoPath) {
  try {
    console.log(`\nCleaning up repository at ${repoPath}...`);
    await fs.rm(repoPath, { recursive: true, force: true });
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

/**
 * Main function
 */
async function main(cleanup = false) {
  try {
    console.log('Testing Lovable Component Analysis');
    console.log('=================================');
    
    // Set up repository access
    const repoAccess = new LocalCloneAccess({
      repoUrl: LOVABLE_REPO,
      localPath: LOCAL_PATH,
      branch: 'main',
      componentPattern: 'src/{componentName}'
    });

    // Clone and set up the repository
    console.log('\nSetting up repository...');
    await repoAccess.setup();
    
    // List components
    console.log('\nListing components...');
    const components = await repoAccess.listComponents();
    console.log('Available components:');
    components.forEach(component => console.log(`- ${component}`));
    
    // Get and analyze a component
    if (components.length > 0) {
      const componentName = components[0];
      console.log(`\nAnalyzing component: ${componentName}`);
      
      // Get component files
      const files = await repoAccess.getComponentFiles(componentName);
      console.log(`Component has ${files.length} files`);
      
      // Analyze component
      const analysis = await analyzeComponent(files);
      
      // Display analysis results
      console.log('\nAnalysis Results:');
      console.log('Colors:');
      analysis.colors.forEach(color => console.log(`- ${color}`));
      
      console.log('\nBorder Radii:');
      analysis.borderRadii.forEach(radius => console.log(`- ${radius}`));
      
      console.log('\nShadows:');
      analysis.shadows.forEach(shadow => console.log(`- ${shadow}`));
      
      console.log('\nTailwind Classes:');
      const tailwindCategories = categorizeClasses(analysis.tailwindClasses);
      Object.entries(tailwindCategories).forEach(([category, classes]) => {
        if (classes.length > 0) {
          console.log(`- ${category}: ${classes.join(', ')}`);
        }
      });
      
      // Perform token transformation if requested
      const shouldTransform = process.argv.includes('--transform');
      if (shouldTransform) {
        console.log('\nTransforming component to use design tokens...');
        
        // Simple mock transformation for demonstration
        const transformedFiles = files.map(file => {
          // Skip non-component files
          if (!file.name.endsWith('.tsx') && !file.name.endsWith('.jsx')) {
            return file;
          }
          
          let content = file.content;
          
          // Mock color transformation
          for (const color of analysis.colors) {
            // For demonstration, we'll replace with a mock token
            // In a real implementation, we would match with actual design tokens
            content = content.replace(
              new RegExp(color, 'g'),
              `var(--color-${color.replace('#', 'color-')})`
            );
          }
          
          // Mock border radius transformation
          for (const radius of analysis.borderRadii) {
            if (radius.endsWith('px')) {
              // Transform CSS values
              content = content.replace(
                new RegExp(`border-radius:\\s*${radius}`, 'g'),
                `border-radius: var(--radius-${radius.replace('px', '')})`
              );
              
              // Transform Tailwind classes
              content = content.replace(
                new RegExp(`rounded-\\[${radius}\\]`, 'g'),
                `rounded-${radius.replace('px', '')}`
              );
            }
          }
          
          return {
            ...file,
            content
          };
        });
        
        // Get output directory path
        const outputDir = path.join(LOCAL_PATH, 'transformed');
        
        // Create output directory
        await fs.mkdir(outputDir, { recursive: true });
        
        // Write transformed files
        for (const file of transformedFiles) {
          const outputPath = path.join(outputDir, file.path);
          const outputDirPath = path.dirname(outputPath);
          
          // Create output directory if it doesn't exist
          await fs.mkdir(outputDirPath, { recursive: true });
          
          // Write transformed file
          await fs.writeFile(outputPath, file.content);
        }
        
        console.log(`\nTransformed files saved to: ${outputDir}`);
        console.log('Sample transformations:');
        
        // Show sample transformations for colors and border radii
        console.log('- Colors:');
        analysis.colors.slice(0, 3).forEach(color => console.log(`  ${color} -> var(--color-${color.replace('#', 'color-')})`));
        
        console.log('- Border Radii:');
        analysis.borderRadii
          .filter(radius => radius.endsWith('px'))
          .slice(0, 3)
          .forEach(radius => console.log(`  ${radius} -> var(--radius-${radius.replace('px', '')})`));
      }
    }
    
    console.log('\nComponent analysis completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    if (cleanup) {
      await cleanupRepository(LOCAL_PATH);
    } else {
      console.log('\nSkipping cleanup. Repository remains at:', LOCAL_PATH);
    }
  }
}

// Check if cleanup flag is passed
const shouldCleanup = process.argv.includes('--cleanup');

// Run the test
main(shouldCleanup);