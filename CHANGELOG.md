# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Implemented Phase 2 of Lovable Component Transformer
- Created component analyzer functionality:
  - Extraction of color values from component files
  - Extraction of border radius values
  - Extraction of shadow values
  - Extraction and categorization of Tailwind classes
- Built component transformer functionality:
  - Transformation of hex colors to CSS variables
  - Transformation of border radius values to CSS variables
  - Transformation of shadow values to CSS variables
  - Transformation of Tailwind classes to token-based classes
- Added standalone script for testing component analysis and transformation

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