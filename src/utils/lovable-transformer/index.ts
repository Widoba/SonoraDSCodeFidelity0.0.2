// Export the repository access module
export * from './repository-access';

// Export the CLI module
export * from './cli/types';
export { handleCLI } from './cli';

/**
 * Description of the Lovable transformer
 */
export const description = `
Lovable Component Transformer

This utility transforms components from Lovable.dev to use Sonora Design System tokens.
It analyzes component code to identify hardcoded styling values and transforms them to
use design tokens, maintaining design fidelity while promoting consistency.

Features:
- Extract components from Lovable repositories (GitHub API or local clone)
- Transform hardcoded style values to use design tokens
- Save transformed components to your design system
`;

/**
 * Version of the Lovable transformer
 */
export const version = '0.1.0';