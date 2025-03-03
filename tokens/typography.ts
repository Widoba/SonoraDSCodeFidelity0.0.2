// Typography Design Tokens
import { TypographyTokens, TypographyStyle } from './types';

const typography: TypographyTokens = {
  // Base font family
  fontFamily: {
    base: {
      value: 'Open Sans',
      name: 'font-sans',
      figmaName: 'Open Sans'
    }
  },

  // Headlines
  headlines: {
    h1: {
      name: 'text-headline-h1',
      figmaName: 'Header 1',
      size: {
        value: '20px',
        twClass: 'text-xl'
      },
      weight: {
        value: '600',
        twClass: 'font-semibold'
      },
      lineHeight: {
        value: 1.4,
        twClass: 'leading-7' // 28px (20px * 1.4)
      },
      usage: 'Main page titles'
    },
    h2: {
      name: 'text-headline-h2',
      figmaName: 'Header 2',
      size: {
        value: '16px',
        twClass: 'text-base'
      },
      weight: {
        value: '600',
        twClass: 'font-semibold'
      },
      lineHeight: {
        value: 1.4,
        twClass: 'leading-[22px]'
      },
      usage: 'Section titles'
    },
    h3: {
      name: 'text-headline-h3',
      figmaName: 'Header 3',
      size: {
        value: '14px',
        twClass: 'text-sm'
      },
      weight: {
        value: '600',
        twClass: 'font-semibold'
      },
      lineHeight: {
        value: 1.4,
        twClass: 'leading-5' // 20px
      },
      usage: 'Subsection titles'
    }
  },

  // Body text
  body: {
    regular: {
      name: 'text-body',
      figmaName: 'Body',
      size: {
        value: '14px',
        twClass: 'text-sm'
      },
      weight: {
        value: '400',
        twClass: 'font-normal'
      },
      lineHeight: {
        value: 1.4,
        twClass: 'leading-5' // 20px
      },
      usage: 'Standard paragraph text'
    }
  },

  // Interactive elements
  interactive: {
    button: {
      base: {
        name: 'text-button',
        figmaName: 'Button',
        size: {
          value: '14px',
          twClass: 'text-sm'
        },
        weight: {
          value: '600',
          twClass: 'font-semibold'
        },
        lineHeight: {
          value: 1.4,
          twClass: 'leading-5' // 20px
        },
        usage: 'Standard button text'
      },
      small: {
        name: 'text-button-sm',
        figmaName: 'Button (sm)',
        size: {
          value: '12px',
          twClass: 'text-xs'
        },
        weight: {
          value: '600',
          twClass: 'font-semibold'
        },
        lineHeight: {
          value: 1.4,
          twClass: 'leading-[17px]'
        },
        usage: 'Small button text'
      }
    },
    link: {
      name: 'text-link',
      figmaName: 'Link',
      size: {
        value: '14px',
        twClass: 'text-sm'
      },
      weight: {
        value: '600',
        twClass: 'font-semibold'
      },
      lineHeight: {
        value: 1.4,
        twClass: 'leading-5' // 20px
      },
      usage: 'Hyperlink text'
    }
  },

  // Form elements
  forms: {
    input: {
      large: {
        name: 'text-input-lg',
        figmaName: 'Input (lg)',
        size: {
          value: '16px',
          twClass: 'text-base'
        },
        weight: {
          value: '400',
          twClass: 'font-normal'
        },
        lineHeight: {
          value: 1.4,
          twClass: 'leading-[22px]'
        },
        usage: 'Large form input text'
      },
      small: {
        name: 'text-input-sm',
        figmaName: 'Input (sm)',
        size: {
          value: '14px',
          twClass: 'text-sm'
        },
        weight: {
          value: '400',
          twClass: 'font-normal'
        },
        lineHeight: {
          value: 1.4,
          twClass: 'leading-5' // 20px
        },
        usage: 'Small form input text'
      }
    }
  },

  // UI elements
  ui: {
    subtitle: {
      base: {
        name: 'text-subtitle',
        figmaName: 'Subtitle',
        size: {
          value: '14px',
          twClass: 'text-sm'
        },
        weight: {
          value: '600',
          twClass: 'font-semibold'
        },
        lineHeight: {
          value: 1.4,
          twClass: 'leading-5' // 20px
        },
        usage: 'Standard subtitles'
      },
      mini: {
        name: 'text-subtitle-mini',
        figmaName: 'Subtitle (mini)',
        size: {
          value: '12px',
          twClass: 'text-xs'
        },
        weight: {
          value: '600',
          twClass: 'font-semibold'
        },
        lineHeight: {
          value: 1.4,
          twClass: 'leading-[17px]'
        },
        usage: 'Small subtitles'
      }
    },
    tabLabel: {
      name: 'text-tab-label',
      figmaName: 'Tab Label',
      size: {
        value: '12px',
        twClass: 'text-xs'
      },
      weight: {
        value: '600',
        twClass: 'font-semibold'
      },
      lineHeight: {
        value: 1.4,
        twClass: 'leading-[17px]'
      },
      usage: 'Tab navigation labels'
    },
    avatar: {
      base: {
        name: 'text-avatar',
        figmaName: 'Avatar',
        size: {
          value: '12px',
          twClass: 'text-xs'
        },
        weight: {
          value: '700',
          twClass: 'font-bold'
        },
        lineHeight: {
          value: 1.4,
          twClass: 'leading-[17px]'
        },
        usage: 'Standard avatar text'
      },
      small: {
        name: 'text-avatar-sm',
        figmaName: 'Avatar (sm)',
        size: {
          value: '10px',
          twClass: 'text-[10px]'
        },
        weight: {
          value: '600',
          twClass: 'font-semibold'
        },
        lineHeight: {
          value: 1.4,
          twClass: 'leading-[14px]'
        },
        usage: 'Small avatar text'
      }
    },
    tooltip: {
      name: 'text-tooltip',
      figmaName: 'Tooltip',
      size: {
        value: '12px',
        twClass: 'text-xs'
      },
      weight: {
        value: '600',
        twClass: 'font-semibold'
      },
      lineHeight: {
        value: 1.4,
        twClass: 'leading-[17px]'
      },
      usage: 'Tooltip text'
    }
  }
};

/**
 * Create a flat map of all typography styles
 */
export const flatTypographyStyles = (): Record<string, TypographyStyle> => {
  const result: Record<string, TypographyStyle> = {};
  
  // Helper to collect all typography styles
  const collectStyles = (obj: any) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        if (value.name && value.figmaName && value.size && value.weight) {
          // This is a typography style
          result[value.name] = value as TypographyStyle;
          result[value.figmaName] = value as TypographyStyle;
        } else {
          // This is a nested category
          collectStyles(value);
        }
      }
    });
  };
  
  collectStyles(typography);
  return result;
};

/**
 * Get all typography styles as a flat array
 */
export const getAllTypographyStyles = (): TypographyStyle[] => {
  const flat = flatTypographyStyles();
  // Filter out duplicates (figmaName entries)
  return Object.values(flat).filter((style, index, self) => 
    self.findIndex(s => s.name === style.name) === index
  );
};

/**
 * Get a typography style by its Figma name
 */
export const getTypographyByFigmaName = (figmaName: string): TypographyStyle | undefined => {
  const flat = flatTypographyStyles();
  return flat[figmaName];
};

/**
 * Get a typography style by its semantic name
 */
export const getTypographyByName = (name: string): TypographyStyle | undefined => {
  const flat = flatTypographyStyles();
  return flat[name];
};

/**
 * Get a typography style by either name or Figma name
 */
export const getTypographyStyle = (nameOrFigmaName: string): TypographyStyle | undefined => {
  return getTypographyByName(nameOrFigmaName) || getTypographyByFigmaName(nameOrFigmaName);
};

/**
 * Get complete text style classes for a typography token
 */
export const getTextStyleClasses = (nameOrFigmaName: string): string => {
  const style = getTypographyStyle(nameOrFigmaName);
  
  if (!style) {
    throw new Error(`Typography style "${nameOrFigmaName}" not found`);
  }
  
  const classes = [
    style.size.twClass,
    style.weight.twClass,
    style.lineHeight?.twClass || ''
  ].filter(Boolean);
  
  return classes.join(' ');
};

/**
 * Get complete text style classes by path (deprecated, but kept for backward compatibility)
 */
export const getTextStyleByPath = (path: string): string => {
  // Split the path into parts
  const parts = path.split('.');
  
  if (parts.length < 2) {
    throw new Error('Typography path must have at least a category and variant (e.g., "body.regular")');
  }
  
  // Map common paths to style names
  const pathMap: Record<string, string> = {
    'headlines.h1': 'Header 1',
    'headlines.h2': 'Header 2',
    'headlines.h3': 'Header 3',
    'body.regular': 'Body',
    'interactive.button.base': 'Button',
    'interactive.button.small': 'Button (sm)',
    'interactive.link': 'Link',
    'forms.input.large': 'Input (lg)',
    'forms.input.small': 'Input (sm)',
    'ui.subtitle.base': 'Subtitle',
    'ui.subtitle.mini': 'Subtitle (mini)',
    'ui.tabLabel': 'Tab Label',
    'ui.avatar.base': 'Avatar',
    'ui.avatar.small': 'Avatar (sm)',
    'ui.tooltip': 'Tooltip'
  };
  
  const figmaName = pathMap[path];
  if (figmaName) {
    return getTextStyleClasses(figmaName);
  }
  
  // If no mapping found, try to navigate through the object
  let result: any = typography;
  
  for (const part of parts) {
    if (result[part] === undefined) {
      throw new Error(`Typography path "${path}" is invalid at "${part}"`);
    }
    result = result[part];
  }
  
  if (result.name) {
    return getTextStyleClasses(result.name);
  }
  
  throw new Error(`Typography token at "${path}" does not have expected properties`);
};

export default typography;
