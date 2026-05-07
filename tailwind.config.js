/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#047857',
          soft: '#ECFDF5',
          edge: '#A7F3D0',
          ink: '#065F46',
        },
        gold: {
          DEFAULT: '#F59E0B',
          deep: '#D97706',
          soft: '#FFFBEB',
          edge: '#FDE68A',
          ink: '#92400E',
        },
      },
    },
  },
  plugins: [],
};
