module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {},
    minHeight: {
      40: '10rem',
    },
    maxWidth: {
      '1/2': '50%',
    },
  },
  plugins: [],
};
