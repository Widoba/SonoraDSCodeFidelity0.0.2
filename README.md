# Lovable Component Transformer

A tool for transforming Lovable.dev components to use Sonora Design System tokens.

## Features

- Repository access to Lovable components
- Component analysis for design values
- Transformation of hardcoded values to design token references
- CLI interface for easy usage

## Usage

### Install Dependencies

```bash
npm install
```

### Analyze a Component

```bash
# Using TypeScript CLI
ts-node scripts/cli/lovable-transformer.ts analyze -n component-name -p path/to/repo

# Using standalone script (for checkbox component)
node scripts/cli/transform-checkbox.js
```

### Transform a Component

```bash
# Using TypeScript CLI
ts-node scripts/cli/lovable-transformer.ts transform -n component-name -p path/to/repo -d output/path

# Transform the example checkbox component
ts-node scripts/cli/lovable-transformer.ts transform-checkbox
```

## Testing

Test transforming the checkbox component:

```bash
# Clone and transform the checkbox component
git clone https://github.com/Widoba/p-941299.git tmp/checkbox-component
node scripts/cli/transform-checkbox.js
```

## Development

The project follows a phased approach:

1. ✅ Phase 1: Repository access implementation
2. ✅ Phase 2: Component analysis and token transformation
3. ⬜ Phase 3: Component integration into the design system

## License

Proprietary - All rights reserved