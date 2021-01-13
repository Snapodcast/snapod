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
      keyframes: {
        extendMainHeaderKey: {
          '100%': {
            width: '100%',
            left: '0px',
            paddingLeft: '6rem',
          },
          '0%': {
            width: 'calc(100% - 220px)',
            left: '220px',
            paddingLeft: '1rem',
          },
        },
        restoreMainHeaderKey: {
          '0%': {
            width: '100%',
            left: '0px',
            paddingLeft: '6rem',
          },
          '100%': {
            width: 'calc(100% - 220px)',
            left: '220px',
            paddingLeft: '1rem',
          },
        },
        extendMainBodyKey: {
          '100%': {
            width: '100%',
            left: '0px',
          },
          '0%': {
            width: 'calc(100% - 220px)',
            left: '220px',
          },
        },
        restoreMainBodyKey: {
          '0%': {
            width: '100%',
            left: '0px',
          },
          '100%': {
            width: 'calc(100% - 220px)',
            left: '220px',
          },
        },
        firstShowKey: {
          '100%': {
            opacity: 1,
          },
          '0%': {
            opacity: 0,
          },
        },
      },
      animation: {
        extendMainBody: 'extendMainBodyKey .5s ease-in-out',
        restoreMainBody: 'restoreMainBodyKey .5s ease-in-out',
        extendMainHeader: 'extendMainHeaderKey .5s ease-in-out',
        restoreMainHeader: 'restoreMainHeaderKey .5s ease-in-out',
        firstShow: 'firstShowKey .25s ease-in-out',
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
