module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        main: 'calc(100% - 220px)',
      },
      colors: {
        active: 'rgba(51,51,51,10%)',
        select: 'rgb(51,51,51,5%)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
