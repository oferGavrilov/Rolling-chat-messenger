/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow:{
        dark: '0 9px 14px 1px #082818',
      },
      fontFamily: {
        'sf-regular': ['sf-pro-display', 'sans-serif'],
        lilita: ['Lilita' ,'cursive' , 'bold'],
        alfa: ['Alfa Slab One' , 'sans-serif'],
      },
      dropShadow: {
        'primary': 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px #84a98c)'
      },
      colors: {
        'dark-primary-bg':'#1B4E3B',
        'dark-secondary-bg':'#267055',
        'dark-tertiary-bg':'#32926F',
        'dark-primary-text':'#ffffff',
        'dark-secondary-text':'#40916c',
        'dark-tertiary-text':'#52b788',
        'dark-black-text':'#081c15',
        'dark-hover-color':'#1b4332',
        'dark-navigation-bg':'#1b4332',
        'light-navigation-bg':'#FAFAFA',
        'bg-light-primary':'#ffffff',
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

