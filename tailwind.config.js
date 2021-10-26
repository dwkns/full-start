const tailwindTheme = require('tailwindcss/defaultTheme');
const debugScreens = require('tailwindcss-debug-screens');

const brandRed = '#ee88a1';

module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.njk',
    './src/**/*.js',
    './src/**/*.md',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1300px',
      '2xl': '1500px',
      '3xl': '1600px',
    },
    extend: {
      colors: {
        'brand-red': brandRed,
      },
      fontFamily: {
        'sans': ['Inter', ...tailwindTheme.fontFamily.sans],
      },
      spacing: {
        'u2-pad': 'clamp(1.2rem, 3vw, 8rem)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [debugScreens],
}
