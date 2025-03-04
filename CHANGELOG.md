# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Completed Phase 2 of Lovable Component Transformer with full integration
- Created component analyzer functionality:
  - Extraction of color values from component files (hex and rgba)
  - Extraction of border radius values
  - Extraction of shadow values
  - Extraction and categorization of Tailwind classes
- Built component transformer functionality:
  - Transformation of hex colors to CSS variables
  - Transformation of rgba colors to CSS variables
  - Transformation of border radius values to CSS variables
  - Transformation of shadow values to CSS variables
  - Transformation of Tailwind classes to token-based classes
- Enhanced CLI with transform command integration:
  - Added transform command to TypeScript CLI
  - Added dedicated transform-checkbox command for easy testing
  - Added standalone script for testing component transformation without TypeScript compilation
- Demonstrated successful transformation with real Lovable checkbox component

### Fixed
- Support for rgba color values in both analysis and transformation
- Improved handling of Tailwind utility variants using the `cn()` function
- Enhanced extraction regex patterns for better match accuracy

## [0.0.2] - 2025-03-03
### Added
- Implemented Phase 1 of Lovable Component Transformer
- Created repository access infrastructure:
  - Interface for consistent repository access
  - Local Git clone implementation
  - Structure for GitHub API access
- Built testing functionality:
  - Test script to verify repository access
  - Cleanup functionality to manage disk usage
  - npm commands for testing with/without cleanup

### Fixed
- Converted TypeScript to CommonJS for better compatibility
- Corrected error handling in the test script
- Implemented proper cleanup with fs.rm

## [0.0.1] - Initial Release
- Initial project setup
- Base token system structure
- Token explorer UI
- Token transformation prototype