/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './app/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['VisbyCF', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Purples (primary scale)
        primaryDark: '#771FAC',
        primary: '#8F27CE',
        primaryLight: '#B885D8',
        primaryTint1: '#F1DBFF',
        primaryTint2: '#F7EBFF',
        // States
        primaryDisabled: '#CFAEE6',
        secondaryDisabled: '#F2E6FB',
        // Inputs
        inputBorder: '#D1D1D1',
        // Neutrals
        white: '#FFFFFF',
        gray100: '#EFEFEF',
        gray200: '#EFEFEF',
        gray300: '#B3B3B3',
        gray500: '#727272',
        gray700: '#252525',
        black: '#252525',
        // Semantic
        success: '#46A449',
        danger: '#BB163A',
        warning: '#F8B82D',
        info: '#63B1FF',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        sm: '0 1px 6px rgba(0,0,0,0.08)',
        md: '0 4px 12px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
