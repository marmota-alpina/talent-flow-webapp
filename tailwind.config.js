/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Primary blue color from ADR-010
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Inter font from ADR-010
      },
    },
  },
  plugins: [],
}
