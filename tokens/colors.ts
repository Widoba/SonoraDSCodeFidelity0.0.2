// Color Design Tokens
import { ColorTokens, ColorToken } from './types';

export const colors: ColorTokens = {
  // Primary Neutrals
  neutral: {
    white: {
      value: '#FFFFFF',
      name: 'neutral-white',
      figmaName: 'White',
      usage: 'backgrounds'
    },
    charcoal: {
      value: '#555555',
      name: 'neutral-charcoal',
      figmaName: 'Charcoal',
      usage: 'headlines, body text, labels'
    }
  },

  // Primary Accent - Olivia Blue
  olivia: {
    base: {
      value: '#25C9D0',
      name: 'olivia-blue',
      figmaName: 'Olivia Blue',
      usage: 'primary accent'
    },
    dark: {
      value: '#0BB4BA',
      name: 'olivia-blue-dark',
      figmaName: 'Olivia Blue Dark',
      usage: 'button hover, focus'
    },
    t600: {
      value: '#BDE6E8',
      name: 'olivia-blue-t600',
      figmaName: 'Olivia Blue T600',
      usage: 'disabled states'
    },
    t700: {
      value: '#CCF4F3',
      name: 'olivia-blue-t700',
      figmaName: 'Olivia Blue T700',
      usage: 'chat borders'
    },
    t900: {
      value: '#E5FCFB',
      name: 'olivia-blue-t900',
      figmaName: 'Olivia Blue T900',
      usage: 'background tint, calendar picker'
    },
    t950: {
      value: '#F7FFFF',
      name: 'olivia-blue-t950',
      figmaName: 'Olivia Blue T950',
      usage: 'lightest background tint, chat backgrounds'
    }
  },

  // Secondary Accent
  midnight: {
    teal: {
      value: '#395E66',
      name: 'midnight-teal',
      figmaName: 'Midnight Teal',
      usage: 'scheduling and events'
    }
  },

  // Secondary Greys
  grey: {
    earl: {
      value: '#A9A9A9',
      name: 'grey-earl',
      figmaName: 'Earl Grey (Light Grey)',
      usage: 'secondary text, icons'
    },
    steel: {
      value: '#DADCE0',
      name: 'grey-steel',
      figmaName: 'Steel Grey (Darkest Border)',
      usage: 'darkest borders'
    },
    glitter: {
      value: '#EDEDED',
      name: 'grey-glitter',
      figmaName: 'Glitter Grey (Divider)',
      usage: 'dividers, candidate response borders'
    },
    disco: {
      value: '#F2F2F2',
      name: 'grey-disco',
      figmaName: 'Disco Grey (Chat Border)',
      usage: 'chat borders'
    },
    fog: {
      value: '#F8F8F8',
      name: 'grey-fog',
      figmaName: 'Fog Grey (Grayfield 1)',
      usage: 'background, candidate response fields'
    },
    mist: {
      value: '#FCFCFC',
      name: 'grey-mist',
      figmaName: 'Mist Grey (Grayfield 2)',
      usage: 'lightest grey background'
    }
  },

  // Feedback Colors
  feedback: {
    danger: {
      base: {
        value: '#E52D2D',
        name: 'danger-red',
        figmaName: 'Danger Red',
        usage: 'warnings, destructive actions'
      },
      dark: {
        value: '#BF1818',
        name: 'danger-red-dark',
        figmaName: 'Danger Red Dark'
      },
      t300: {
        value: '#FAC4C4',
        name: 'danger-red-t300',
        figmaName: 'Danger Red T300'
      },
      t900: {
        value: '#FDEDED',
        name: 'danger-red-t900',
        figmaName: 'Danger Red T900'
      }
    },
    caution: {
      base: {
        value: '#F9BC4F',
        name: 'caution-yellow',
        figmaName: 'Caution Yellow',
        usage: 'caution, missing information'
      },
      dark: {
        value: '#E08F00',
        name: 'caution-yellow-dark',
        figmaName: 'Caution Yellow Dark'
      },
      t300: {
        value: '#FBD288',
        name: 'caution-yellow-t300',
        figmaName: 'Caution Yellow T300'
      },
      t900: {
        value: '#FEF6E7',
        name: 'caution-yellow-t900',
        figmaName: 'Caution Yellow T900'
      }
    },
    success: {
      base: {
        value: '#39D279',
        name: 'success-green',
        figmaName: 'Go Green',
        usage: 'success states'
      },
      dark: {
        value: '#27AA5D',
        name: 'success-green-dark',
        figmaName: 'Go Green Dark'
      },
      t300: {
        value: '#B4EECC',
        name: 'success-green-t300',
        figmaName: 'Go Green T300'
      },
      t900: {
        value: '#E9FAF0',
        name: 'success-green-t900',
        figmaName: 'Go Green T900'
      }
    }
  },

  // User Type Colors
  user: {
    candidate: {
      value: '#DD7373',
      name: 'user-candidate',
      figmaName: 'Cardinal Red (Candidate)',
      usage: 'candidate avatars'
    },
    employee: {
      value: '#3BCEAC',
      name: 'user-employee',
      figmaName: 'Cactus Green (Employee)',
      usage: 'employee avatars'
    },
    admin: {
      value: '#233D4D',
      name: 'user-admin',
      figmaName: 'Navy Blue (User)',
      usage: 'admin user avatars'
    }
  },

  // eCEM Colors
  ecem: {
    sky: {
      base: {
        value: '#37A9E9',
        name: 'ecem-sky-blue',
        figmaName: 'Sky Blue'
      },
      dark: {
        value: '#126892',
        name: 'ecem-sky-blue-dark',
        figmaName: 'Sky Blue Dark'
      },
      t600: {
        value: '#B7E0F7',
        name: 'ecem-sky-blue-t600',
        figmaName: 'Sky Blue T600'
      },
      t800: {
        value: '#D7EEFB',
        name: 'ecem-sky-blue-t800',
        figmaName: 'Sky Blue T800'
      }
    },
    twilight: {
      base: {
        value: '#AD8CE2',
        name: 'ecem-twilight-purple',
        figmaName: 'Twilight Purple'
      },
      dark: {
        value: '#56499B',
        name: 'ecem-twilight-purple-dark',
        figmaName: 'Twilight Purple Dark'
      },
      t400: {
        value: '#CEBAEE',
        name: 'ecem-twilight-purple-t400',
        figmaName: 'Twilight Purple T400'
      },
      t800: {
        value: '#EFE8F9',
        name: 'ecem-twilight-purple-t800',
        figmaName: 'Twilight Purple T800'
      }
    },
    magenta: {
      base: {
        value: '#C961AA',
        name: 'ecem-prickly-pear-magenta',
        figmaName: 'Prickly Pear Magenta'
      },
      dark: {
        value: '#64347F',
        name: 'ecem-prickly-pear-magenta-dark',
        figmaName: 'Prickly Pear Magenta Dark'
      },
      t400: {
        value: '#DFA0CC',
        name: 'ecem-prickly-pear-magenta-t400',
        figmaName: 'Prickly Pear Magenta T400'
      },
      t800: {
        value: '#F4DFEE',
        name: 'ecem-prickly-pear-magenta-t800',
        figmaName: 'Prickly Pear Magenta T800'
      }
    },
    desert: {
      base: {
        value: '#FE6D73',
        name: 'ecem-desert-red',
        figmaName: 'Desert Red'
      },
      dark: {
        value: '#7F3A64',
        name: 'ecem-desert-red-dark',
        figmaName: 'Desert Red Dark'
      },
      t400: {
        value: '#FEA7AB',
        name: 'ecem-desert-red-t400',
        figmaName: 'Desert Red T400'
      },
      t800: {
        value: '#FFE2E3',
        name: 'ecem-desert-red-t800',
        figmaName: 'Desert Red T800'
      }
    },
    dune: {
      base: {
        value: '#FF9B71',
        name: 'ecem-dune-orange',
        figmaName: 'Dune Orange'
      },
      dark: {
        value: '#B24213',
        name: 'ecem-dune-orange-dark',
        figmaName: 'Dune Orange Dark'
      },
      t400: {
        value: '#FFC3AA',
        name: 'ecem-dune-orange-t400',
        figmaName: 'Dune Orange T400'
      },
      t800: {
        value: '#FFEBE3',
        name: 'ecem-dune-orange-t800',
        figmaName: 'Dune Orange T800'
      }
    }
  }
};

/**
 * Creates a flat map of all color tokens for easy lookup
 */
export const flatColorTokens = (): Record<string, ColorToken> => {
  const result: Record<string, ColorToken> = {};
  
  // Helper function to flatten nested structure
  const flatten = (obj: any, parentKey: string = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'value' in value) {
        // This is a token
        result[value.name] = value as ColorToken;
        result[value.figmaName] = value as ColorToken; // Also allow lookup by Figma name
      } else if (value && typeof value === 'object') {
        // This is a nested category
        flatten(value, `${parentKey}${key}.`);
      }
    });
  };
  
  flatten(colors);
  return result;
};

/**
 * Get all color tokens as a flat array 
 */
export const getAllColorTokens = (): ColorToken[] => {
  const flat = flatColorTokens();
  // Filter out duplicates (figmaName entries)
  return Object.values(flat).filter((token, index, self) => 
    self.findIndex(t => t.name === token.name) === index
  );
};

/**
 * Get a color token by its Figma name
 */
export const getColorByFigmaName = (figmaName: string): ColorToken | undefined => {
  const flat = flatColorTokens();
  return flat[figmaName];
};

/**
 * Get a color token by its semantic name
 */
export const getColorByName = (name: string): ColorToken | undefined => {
  const flat = flatColorTokens();
  return flat[name];
};

/**
 * Get a color token by either name or Figma name
 */
export const getColorToken = (nameOrFigmaName: string): ColorToken | undefined => {
  return getColorByName(nameOrFigmaName) || getColorByFigmaName(nameOrFigmaName);
};

/**
 * Get a color token's value
 */
export const getColorValue = (nameOrFigmaName: string): string => {
  const token = getColorToken(nameOrFigmaName);
  
  if (!token) {
    throw new Error(`Color token "${nameOrFigmaName}" not found`);
  }
  
  return token.value;
};

/**
 * Convert color tokens to Tailwind config format
 */
export const colorTokensToTailwind = () => {
  const result: Record<string, string> = {};
  
  getAllColorTokens().forEach(token => {
    result[token.name] = token.value;
  });
  
  return result;
};

export default colors;
