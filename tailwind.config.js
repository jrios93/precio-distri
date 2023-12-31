/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      sm: "576px",
      // => @media (min-width: 576px) { ... }

      md: "960px",
      // => @media (min-width: 960px) { ... }

      lg: "1440px",
      // => @media (min-width: 1440px) { ... }
    },
    
    extend: {colors:{
      'silverb':'#0C1317',
      'backcards':'#303642',
      'btncolor':'#5734ee',
      'textdark':'#93969c',
    },},
  },
  plugins: [],
};
