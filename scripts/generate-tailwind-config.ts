import { writeFileSync } from 'fs';
import path from 'path';
import { generateTailwindConfig } from '../tokens/token-index';

// Generate the Tailwind configuration
const tailwindConfig = `const tokens = require('../tokens/token-index');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: tokens.colorTokensToTailwind(),
      borderRadius: tokens.borderRadiusToTailwind(),
      boxShadow: tokens.shadowsToTailwind(),
    }
  },
  safelist: ${JSON.stringify(generateTailwindConfig().safelist, null, 2)},
  plugins: [],
}`;

// Write the configuration to tailwind.config.js
writeFileSync(
  path.join(__dirname, '../tailwind.config.js'),
  tailwindConfig,
  'utf8'
);

console.log('✅ Tailwind configuration generated successfully!');

// Generate CSS variables
const cssVariables = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* CSS Variables Generated from Design Tokens */
${generateCssVariables()}
}
`;

// Function to generate CSS variables string
function generateCssVariables() {
  const { getAllColorTokens, getAllBorderRadiusTokens, getAllShadowTokens } = require('../tokens/token-index');
  
  let css = '';
  
  // Add color variables
  getAllColorTokens().forEach((token: any) => {
    css += `  --color-${token.name}: ${token.value};\n`;
  });
  
  // Add border radius variables
  getAllBorderRadiusTokens().forEach((token: any) => {
    css += `  --radius-${token.name.replace('radius-', '')}: ${token.value};\n`;
  });
  
  // Add shadow variables
  getAllShadowTokens().forEach((token: any) => {
    css += `  --shadow-${token.name.replace('shadow-', '')}: ${token.value};\n`;
  });
  
  return css;
}

// Write the CSS variables to globals.css
writeFileSync(
  path.join(__dirname, '../src/app/globals.css'),
  cssVariables,
  'utf8'
);

console.log('✅ CSS variables generated successfully!');