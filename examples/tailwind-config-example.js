/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Colors
      colors: {
        // Primary Neutrals
        'neutral-white': '#FFFFFF',
        'neutral-charcoal': '#555555',
        
        // Primary Accent - Olivia Blue
        'olivia-blue': '#25C9D0',
        'olivia-blue-dark': '#0BB4BA',
        'olivia-blue-t600': '#BDE6E8',
        'olivia-blue-t700': '#CCF4F3',
        'olivia-blue-t900': '#E5FCFB',
        'olivia-blue-t950': '#F7FFFF',
        
        // Secondary Accent
        'midnight-teal': '#395E66',
        
        // Secondary Greys
        'grey-earl': '#A9A9A9',
        'grey-steel': '#DADCE0',
        'grey-glitter': '#EDEDED',
        'grey-disco': '#F2F2F2',
        'grey-fog': '#F8F8F8',
        'grey-mist': '#FCFCFC',
        
        // Feedback Colors
        'danger-red': '#E52D2D',
        'danger-red-dark': '#BF1818',
        'danger-red-t300': '#FAC4C4',
        'danger-red-t900': '#FDEDED',
        
        'caution-yellow': '#F9BC4F',
        'caution-yellow-dark': '#E08F00',
        'caution-yellow-t300': '#FBD288',
        'caution-yellow-t900': '#FEF6E7',
        
        'success-green': '#39D279',
        'success-green-dark': '#27AA5D',
        'success-green-t300': '#B4EECC',
        'success-green-t900': '#E9FAF0',
        
        // User Type Colors
        'user-candidate': '#DD7373',
        'user-employee': '#3BCEAC',
        'user-admin': '#233D4D',
        
        // eCEM Colors
        'ecem-sky-blue': '#37A9E9',
        'ecem-sky-blue-dark': '#126892',
        'ecem-sky-blue-t600': '#B7E0F7',
        'ecem-sky-blue-t800': '#D7EEFB',
        
        'ecem-twilight-purple': '#AD8CE2',
        'ecem-twilight-purple-dark': '#56499B',
        'ecem-twilight-purple-t400': '#CEBAEE',
        'ecem-twilight-purple-t800': '#EFE8F9',
        
        'ecem-prickly-pear-magenta': '#C961AA',
        'ecem-prickly-pear-magenta-dark': '#64347F',
        'ecem-prickly-pear-magenta-t400': '#DFA0CC',
        'ecem-prickly-pear-magenta-t800': '#F4DFEE',
        
        'ecem-desert-red': '#FE6D73',
        'ecem-desert-red-dark': '#7F3A64',
        'ecem-desert-red-t400': '#FEA7AB',
        'ecem-desert-red-t800': '#FFE2E3',
        
        'ecem-dune-orange': '#FF9B71',
        'ecem-dune-orange-dark': '#B24213',
        'ecem-dune-orange-t400': '#FFC3AA',
        'ecem-dune-orange-t800': '#FFEBE3',
      },
      
      // Border Radius
      borderRadius: {
        '3xs': '2px',
        '2xs': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
      },
      
      // Shadows
      boxShadow: {
        'outer-dark': '0px 3px 9px 0px rgba(0, 0, 0, 0.50)',
        'outer-medium-16': '0px 4px 16px 0px rgba(0, 0, 0, 0.28)',
        'outer-medium-12': '0px 6px 12px 0px rgba(0, 0, 0, 0.18)',
        'tooltip': '0px 2px 8px 0px rgba(0, 0, 0, 0.20)',
        'outer-light': '0px 2px 10px 2px rgba(0, 0, 0, 0.10)',
        'outer-extra-light': '0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
        'inner': '0px 1px 2px 0px rgba(0, 0, 0, 0.20) inset',
      },
      
      // Font Sizes (with associated line-heights)
      fontSize: {
        'headline-h1': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-h2': ['16px', { lineHeight: '22px', fontWeight: '600' }],
        'headline-h3': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'button': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'button-sm': ['12px', { lineHeight: '17px', fontWeight: '600' }],
        'link': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'input-lg': ['16px', { lineHeight: '22px', fontWeight: '400' }],
        'input-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'subtitle': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'subtitle-mini': ['12px', { lineHeight: '17px', fontWeight: '600' }],
        'tab-label': ['12px', { lineHeight: '17px', fontWeight: '600' }],
        'avatar': ['12px', { lineHeight: '17px', fontWeight: '700' }],
        'avatar-sm': ['10px', { lineHeight: '14px', fontWeight: '600' }],
        'tooltip': ['12px', { lineHeight: '17px', fontWeight: '600' }],
      },
    },
  },
  // Safelist ensures that dynamically generated classes are not purged during production builds
  safelist: [
    // Color classes (prefixed with bg-, text-, border-)
    ...[
      'neutral-white', 'neutral-charcoal', 
      'olivia-blue', 'olivia-blue-dark', 'olivia-blue-t600', 'olivia-blue-t700', 'olivia-blue-t900', 'olivia-blue-t950',
      'midnight-teal',
      'grey-earl', 'grey-steel', 'grey-glitter', 'grey-disco', 'grey-fog', 'grey-mist',
      'danger-red', 'danger-red-dark', 'danger-red-t300', 'danger-red-t900',
      'caution-yellow', 'caution-yellow-dark', 'caution-yellow-t300', 'caution-yellow-t900',
      'success-green', 'success-green-dark', 'success-green-t300', 'success-green-t900'
    ].flatMap(color => [`bg-${color}`, `text-${color}`, `border-${color}`]),
    
    // Border radius classes
    ...[
      '3xs', '2xs', 'xs', 'sm', 'md'
    ].map(radius => `rounded-${radius}`),
    
    // Shadow classes
    'shadow-outer-dark', 'shadow-outer-medium-16', 'shadow-outer-medium-12', 
    'shadow-tooltip', 'shadow-outer-light', 'shadow-outer-extra-light', 'shadow-inner',
    
    // Typography classes are handled through compositional classes
  ],
  plugins: [],
}
