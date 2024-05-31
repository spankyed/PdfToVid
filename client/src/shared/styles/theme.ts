import { createTheme } from '@mui/material/styles';
import './index.css';
import { purple, deepPurple, grey, red, amber, blue, deepOrange, indigo, green } from '@mui/material/colors';
import darkScrollbar from '@mui/material/darkScrollbar';

// export const colors = {
//   main: 'rgba(0, 0, 0, 0.3)',
//   sidebar: '',
//   // primary: 'rgb(31,94,168)',
//   primary: [
//     // purple[600],
//     // deepPurple[600],
//     '#5a48a7',
//     ,
//   ]
// }
declare module '@mui/material/styles' {
  interface Palette {
    mom: Palette['primary'];
    amber: Palette['primary'];
    red: Palette['primary'];
  }

  interface PaletteOptions {
    mom?: PaletteOptions['primary'];
    amber?: PaletteOptions['primary'];
    red?: PaletteOptions['primary'];
  }
}

export const colors = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: darkScrollbar(),
      }),
    },
  },
  palette: {
    mode: 'dark',
    success: {
      main: green[600],
    },
    primary: {
      // main: purple[900],
      main: '#4a39ab',
      // main: indigo[600],
      // main: blue[700],
      // main: deepPurple[900],
      // main: '#5a48a7',
      light: '#5a48a7',
      dark: '#3b278e',
      // darker: blue[900],
    },
    secondary: {
      // main: '#7b1fa2',
      main: indigo[700],
      light: indigo[400],

      // main: deepOrange[900],
    },
    background: {
      // default: '#2c2c2c',
      // default: grey[800],
      default: '#171717',
      // paper: '#333',
      paper: grey[900],
    },
    warning:{
      main: amber[700],
    },
    amber: {
      main: amber[900],
    },
    red: {
      main: red[600],
      // main: grey[900],
    },
    mom: {
      main: deepPurple[900],
    }
  },
});





