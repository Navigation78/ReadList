/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ABC270',
        accent1: '#FEC868',
        accent2: '#FDA769',
        dark: '#473C33'
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif']
      },
      backgroundColor: {
        'custom-green': '#ABC270',
        'custom-yellow': '#FEC868',
        'custom-orange': '#FDA769',
        'custom-brown': '#473C33'
      },
      textColor: {
        'custom-brown': '#473C33',
        'custom-green': '#ABC270',
        'custom-yellow': '#FEC868',
        'custom-orange': '#FDA769'
      },
      borderColor: {
        'custom-green': '#ABC270',
        'custom-yellow': '#FEC868',
        'custom-orange': '#FDA769'
      }
    },
  },
  plugins: [],
}
