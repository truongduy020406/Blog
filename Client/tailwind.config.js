module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Thêm font tùy chỉnh
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
