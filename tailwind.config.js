/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'neutral-white': '#FFFFFF',
        'neutral-charcoal': '#555555',
        'olivia-blue': '#25C9D0',
        'olivia-blue-dark': '#0BB4BA',
        'olivia-blue-t600': '#BDE6E8',
        'olivia-blue-t700': '#CCF4F3',
        'olivia-blue-t900': '#E5FCFB',
        'olivia-blue-t950': '#F7FFFF',
        'midnight-teal': '#395E66',
        'grey-earl': '#A9A9A9',
        'grey-steel': '#DADCE0',
        'grey-glitter': '#EDEDED',
        'grey-disco': '#F2F2F2',
        'grey-fog': '#F8F8F8',
        'grey-mist': '#FCFCFC',
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
        'user-candidate': '#DD7373',
        'user-employee': '#3BCEAC',
        'user-admin': '#233D4D',
      },
      borderRadius: {
        '3xs': '2px',
        '2xs': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
      },
      boxShadow: {
        'outer-dark': '0px 3px 9px 0px rgba(0, 0, 0, 0.50)',
        'outer-medium-16': '0px 4px 16px 0px rgba(0, 0, 0, 0.28)',
        'outer-medium-12': '0px 6px 12px 0px rgba(0, 0, 0, 0.18)',
        'tooltip': '0px 2px 8px 0px rgba(0, 0, 0, 0.20)',
        'outer-light': '0px 2px 10px 2px rgba(0, 0, 0, 0.10)',
        'outer-extra-light': '0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
        'inner': '0px 1px 2px 0px rgba(0, 0, 0, 0.20) inset',
      },
    }
  },
  safelist: [
    // Color classes
    'bg-neutral-white', 'bg-neutral-charcoal',
    'bg-olivia-blue', 'bg-olivia-blue-dark', 'bg-olivia-blue-t600', 'bg-olivia-blue-t700', 'bg-olivia-blue-t900', 'bg-olivia-blue-t950',
    'bg-midnight-teal',
    'bg-grey-earl', 'bg-grey-steel', 'bg-grey-glitter', 'bg-grey-disco', 'bg-grey-fog', 'bg-grey-mist',
    'bg-danger-red', 'bg-danger-red-dark', 'bg-danger-red-t300', 'bg-danger-red-t900',
    'bg-caution-yellow', 'bg-caution-yellow-dark', 'bg-caution-yellow-t300', 'bg-caution-yellow-t900',
    'bg-success-green', 'bg-success-green-dark', 'bg-success-green-t300', 'bg-success-green-t900',
    'bg-user-candidate', 'bg-user-employee', 'bg-user-admin',
    
    // Text color classes
    'text-neutral-white', 'text-neutral-charcoal',
    'text-olivia-blue', 'text-olivia-blue-dark', 'text-olivia-blue-t600', 'text-olivia-blue-t700', 'text-olivia-blue-t900', 'text-olivia-blue-t950',
    'text-midnight-teal',
    'text-grey-earl', 'text-grey-steel', 'text-grey-glitter', 'text-grey-disco', 'text-grey-fog', 'text-grey-mist',
    'text-danger-red', 'text-danger-red-dark', 'text-danger-red-t300', 'text-danger-red-t900',
    'text-caution-yellow', 'text-caution-yellow-dark', 'text-caution-yellow-t300', 'text-caution-yellow-t900',
    'text-success-green', 'text-success-green-dark', 'text-success-green-t300', 'text-success-green-t900',
    'text-user-candidate', 'text-user-employee', 'text-user-admin',
    
    // Border color classes
    'border-neutral-white', 'border-neutral-charcoal',
    'border-olivia-blue', 'border-olivia-blue-dark', 'border-olivia-blue-t600', 'border-olivia-blue-t700', 'border-olivia-blue-t900', 'border-olivia-blue-t950',
    'border-midnight-teal',
    'border-grey-earl', 'border-grey-steel', 'border-grey-glitter', 'border-grey-disco', 'border-grey-fog', 'border-grey-mist',
    'border-danger-red', 'border-danger-red-dark', 'border-danger-red-t300', 'border-danger-red-t900',
    'border-caution-yellow', 'border-caution-yellow-dark', 'border-caution-yellow-t300', 'border-caution-yellow-t900',
    'border-success-green', 'border-success-green-dark', 'border-success-green-t300', 'border-success-green-t900',
    'border-user-candidate', 'border-user-employee', 'border-user-admin',
    
    // Border radius classes
    'rounded-3xs', 'rounded-2xs', 'rounded-xs', 'rounded-sm', 'rounded-md',
    
    // Shadow classes
    'shadow-outer-dark', 'shadow-outer-medium-16', 'shadow-outer-medium-12',
    'shadow-tooltip', 'shadow-outer-light', 'shadow-outer-extra-light', 'shadow-inner',
  ],
  plugins: [],
}