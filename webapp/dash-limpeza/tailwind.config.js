/** @type {import('tailwindcss').Config} */

const path = require('path');

module.exports = {
    content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'painel-bg': `url(${path.resolve(__dirname, './src/assets/apto.png')})`,
      },
    },
  },
  plugins: [],
}

