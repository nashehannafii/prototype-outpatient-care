module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // `watch` applies styles for very small devices (max-width: 360px)
        'watch': { 'max': '360px' },
      },
    },
  },
  plugins: [],
};
