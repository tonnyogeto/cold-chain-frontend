/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Adding the custom navy from your reference image
        darkBlue: '#0f172a',
        cardBlue: '#1e293b',
      }
    },
  },
  plugins: [],
}