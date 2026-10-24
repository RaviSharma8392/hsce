export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Open Sans'", 'sans-serif'],
        heading: ["'Poppins'", 'sans-serif'],
        poppins: ["'Poppins'", 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#363991',
          'navy-dark': '#282b7d',
          'navy-deep': '#1b1e5a',
          yellow: '#FFDC13',
          'yellow-dark': '#e6ca18',
          coral: '#e2535d',
        },
      },
    },
  },
  plugins: [],
};
