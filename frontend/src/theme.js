import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shadows: ["none",
    '0px 3px 5px -1px rgba(0,0,0,0.2)',
    '0px 6px 10px 0px rgba(0,0,0,0.14)',
    '0px 3px 5px -1px rgba(0,0,0,0.2)',
    '0px 3px 5px -1px rgba(0,0,0,0.2)',
    '0px 6px 10px 0px rgba(0,0,0,0.14)',
    '0px 3px 5px -1px rgba(0,0,0,0.2)',
    '0px 3px 5px -1px rgba(0,0,0,0.2)',
    '0px 6px 10px 0px rgba(0,0,0,0.14)',
    '0px 3px 5px -1px rgba(0,0,0,0.2)'], // Добавлено значение для shadows[1]
  palette: {
    primary: {
      main: "#ff0000",
    },
    action: {
      hover: "#FEEA98", // Фиолетовый цвет наведения
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Enables dark mode
    primary: {
      main: "#FEEA98",
    },
    background: {
      default: "white", // Background color for the entire application
      paper: "#5b5b5b",   // Background color for paper surfaces, such as cards
    },
    text: {
      primary: "#000000", // Primary text color
      secondary: "#2d4111", // Secondary text color
    },


  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 500,
    },

  },
});
