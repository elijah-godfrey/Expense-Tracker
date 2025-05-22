import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#03a9f4',
      light: '#4fc3f7',
      dark: '#0288d1',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c'
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f'
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00'
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700
    },
    h2: {
      fontWeight: 700
    },
    h3: {
      fontWeight: 600
    },
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    subtitle1: {
      fontWeight: 500
    },
    subtitle2: {
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000000'
    },
    secondary: {
      main: '#81d4fa',
      light: '#e1f5fe',
      dark: '#4fc3f7',
      contrastText: '#000000'
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    success: {
      main: '#81c784',
      light: '#c8e6c9',
      dark: '#66bb6a'
    },
    error: {
      main: '#e57373',
      light: '#ffcdd2',
      dark: '#ef5350'
    },
    warning: {
      main: '#ffb74d',
      light: '#ffe0b2',
      dark: '#ffa726'
    },
    info: {
      main: '#64b5f6',
      light: '#e3f2fd',
      dark: '#42a5f5'
    }
  }
});

export default theme; 