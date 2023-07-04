/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sf-regular': ['sf-pro-display', 'sans-serif'],
        lilita: ['Lilita' ,'cursive' , 'bold'],
        alfa: ['Alfa Slab One' , 'sans-serif'],
      },
      dropShadow: {
        'primary': 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px #84a98c)'
      },
      colors: {
        'primary': '#0099ff',
        'secondary': '#39b0ff',
        'tertiary': '#55bbff',
        'quaternary': '#71c6ff',
        'quinary': '#e3f4ff',
      }
    },
   
  },
  plugins: [],
}

