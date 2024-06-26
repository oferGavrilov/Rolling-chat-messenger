/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl':'1280px',
      '2xl':'1536px',
      '3xl':'1920px',
      '4xl':'2560px',
    },
    extend: {
      boxShadow: {
        dark: '0 9px 14px 1px #082818',
      },
      fontFamily: {
        'sf-regular': ['sf-pro-display', 'sans-serif'],
        'roboto-regular': ['roboto-regular', 'sans-serif'],
      },
      dropShadow: {
        'primary': 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px #84a98c)'
      },
      colors: {
        // 'dark-primary-bg': '#111b21',
        'dark-primary-bg': '#292c31',
        // 'dark-secondary-bg': '#202c33',
        'dark-secondary-bg': '#202324',
        'dark-default-hover-bg': '#495057',
        'dark-dropdown-bg': '#233138',
        'dark-navigation-bg': '#212529',
        'dark-outgoing-chat-bg':'#005c4b',
        'dark-outgoing-chat-reply-bg':'#025144',
        'dark-outgoing-chat-bg-deeper':'#025144',
        'dark-incoming-chat-bg':'#202c33',
        'dark-incoming-chat-reply-bg':'#1d282f',
        'dark-primary-text': '#ffffff',
        'dark-secondary-text': '#242424',
        'dark-input-bg': '#2b3b45',
        'dark-input-placeholder': '#8696a0',
        'light-input-bg':'#e5e7eb',
        'light-text':'#e9ecef',
        'navigation-bg': '#FAFAFA',
        'primary': '#3a72ec',
        'default-hover-bg':'#57c0f8',
        'secondary-text': '#242424',
        'document-text':'#ffffff99',
      }
    },

  },
  plugins: [],
}

