
/** @type {import('tailwindcss').Config} */
module.exports = {
 
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        maincolor1: '#042a2b',
        maincolor2: '#5eb1bf',
        maincolor3: '#54f2f2',
        maincolor4: '#fcfcfc',
        maincolor5: '#f4e04d',
        black1: '#000000',
      },
      boxShadow:{
        'custom-main': '0 0px 50px rgba(94, 177, 191, 1.5)',
        'custom-main2': '0 0px -50px rgba(94, 177, 191, 1.5)',
      }
    },
    
  },
  plugins: [],
}