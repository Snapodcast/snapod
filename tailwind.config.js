module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        main: 'calc(100% - 220px)',
        input: '34px',
      },
      colors: {
        active: 'rgba(51,51,51,10%)',
        select: 'rgb(51,51,51,5%)',
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ['hover', 'group-hover', 'group-focus'],
      display: ['group-focus', 'group-hover'],
      borderWidth: ['group-hover'],
    },
  },
  plugins: [],
};
