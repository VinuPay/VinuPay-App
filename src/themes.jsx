/* eslint-disable max-len */
import createTheme from '@mui/material/styles/createTheme';
const themes = [
  createTheme({
    name: 'Nox',
    typography: {
      fontFamily: 'Inter',
      fontColor: '#9dc6f2',
    },
    palette: {
      mode: 'dark',
      background: {
        sidebar: '#0f1011',
        paper: '#181b1b',
        primary: '#006aff',
      },
      text: {
        primary: '#9dc6f2',
        invoiceTop: '#ffffff',
        sidebar: '#ffffff',
        connectWallet: '#9dc6f2',
      },
      secondary: {
        main: '#62fd1c',
        contrastText: '#000',
      },
      primary: {
        main: '#006aff',
        contrastText: '#9dc6f2',
      },
      error: {
        main: '#fc3333',
        contrastText: '#9dc6f2',
      },
    },
  }),
  createTheme({
    name: 'Lumen',
    typography: {
      fontFamily: 'Inter',
    },
    palette: {
      mode: 'light',
      background: {
        paper: '#ffffff',
        primary: '#006aff',
      },
      text: {
        primary: '#343434',
        sidebar: '#343434',
        connectWallet: '#ffffff',
        invoiceTop: '#ffffff',
        icon: '#343434',
      },
      secondary: {
        main: '#62fd1c',
        contrastText: '#343434',
      },
      primary: {
        main: '#006aff',
        contrastText: '#ffffff',
      },
      error: {
        main: '#fc3333',
        contrastText: '#343434',
      },
    },
  }),
  // Custom themes
];
// eslint-disable-next-line guard-for-in
for (const i in themes) {
  themes[i].components = {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: local(''),
               url('../fonts/inter-v12-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
               url('../fonts/inter-v12-latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 500;
          font-display: swap;
          src: local(''),
               url('../fonts/inter-v12-latin-500.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
               url('../fonts/inter-v12-latin-500.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 600;
          font-display: swap;
          src: local(''),
               url('../fonts/inter-v12-latin-600.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
               url('../fonts/inter-v12-latin-600.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: local(''),
               url('../fonts/inter-v12-latin-700.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
               url('../fonts/inter-v12-latin-700.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 800;
          font-display: swap;
          src: local(''),
               url('../fonts/inter-v12-latin-800.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
               url('../fonts/inter-v12-latin-800.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 900;
          font-display: swap;
          src: local(''),
               url('../fonts/inter-v12-latin-900.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
               url('../fonts/inter-v12-latin-900.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
        }
      `,
    },
  };
}

export default themes;
