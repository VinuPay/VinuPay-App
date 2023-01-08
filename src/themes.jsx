import createTheme from "@mui/material/styles/createTheme";
export const darkTheme = createTheme({
    typography: {
        fontFamily: 'Inter',
        fontColor: '#c7d4fc',
    },
    palette: {
        mode: 'dark',
        background: {
            paper: '#1e1e1e',
        },
        text: {
            primary: '#c7d4fc',
            sidebar: '#ffffff',
        },
        secondary: {
            light: '#56ff00',
            main: '#62fd1c',
            dark: '#56ff00',
            contrastText: '#000',
        },
        primary: {
            light: '#007aff',
            main: '#006aff',
            dark: '#006aff',
            contrastText: '#c7d4fc',
        },
        error: {
            light: '#fc3333',
            main: '#fc3333',
            dark: '#f82727',
            contrastText: '#c7d4fc',
        },
    },
    components: {
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
    },
});

export const lightTheme = createTheme({
    typography: {
        fontFamily: 'Inter',
    },
    palette: {
        mode: 'light',
        text: {
            primary: '#343434',
            sidebar: '#ffffff',
            icon: '#343434',
        },
        secondary: {
            light: '#56ff00',
            main: '#62fd1c',
            dark: '#56ff00',
            contrastText: '#343434',
        },
        primary: {
            light: '#007aff',
            main: '#006aff',
            dark: '#006aff',
            contrastText: '#ffffff',
        },
        error: {
            light: '#fc3333',
            main: '#fc3333',
            dark: '#f82727',
            contrastText: '#343434',
        },
    },
    components: {
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
    },
});
