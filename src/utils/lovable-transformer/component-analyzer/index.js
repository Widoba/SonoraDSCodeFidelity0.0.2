/**
 * Component Analyzer module for Lovable Component Transformer
 * 
 * This module analyzes components for values that can be converted to tokens
 */

/**
 * Analyzes component files for values that can be converted to tokens
 * 
 * @param {Array} componentFiles Array of component files to analyze
 * @returns {Object} Analysis result with colors, border radii, shadows, and Tailwind classes
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
 * 
 * @param {string} content Component file content
 * @returns {Array} Array of hex color values
 */
function extractHexColors(content) {
  // Match hex colors (#fff, #ffffff, etc.)
  const hexRegex = /#([0-9A-Fa-f]{3}){1,2}\b/g;
  const matches = content.match(hexRegex) || [];
  return matches;
}

/**
 * Extract border radius values from code
 * 
 * @param {string} content Component file content
 * @returns {Array} Array of border radius values
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
 * 
 * @param {string} content Component file content
 * @returns {Array} Array of shadow values
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
 * 
 * @param {string} content Component file content
 * @returns {Array} Array of Tailwind classes
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
 * 
 * @param {Array} classes Array of Tailwind classes
 * @returns {Object} Object with categorized classes
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

// Export all functions
module.exports = {
  analyzeComponent,
  extractHexColors,
  extractBorderRadii,
  extractShadows,
  extractTailwindClasses,
  categorizeClasses
};