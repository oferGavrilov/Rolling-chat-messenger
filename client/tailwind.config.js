/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        'primary': 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px #84a98c)'
      },
      colors: {
        'primary': '#27AE60',
        'secondary': '#cad2c5',
        'tertiary': '#52796f',
        'quaternary': '#e9ecef',
        'main-color': '#2f3e46',
      }
    },
    fontFamily: {
      'sf-regular':['sf-pro-display' , 'sans-serif']
    }
  },
  plugins: [],
}

