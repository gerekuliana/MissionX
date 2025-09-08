import { createTheme } from '@mui/material';

export const neonDarkGreenTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00FF00',
      light: '#66FF66',
      dark: '#00CC00',
      contrastText: '#000000',
    },
    secondary: {
      main: '#00FF88',
      light: '#66FFAA',
      dark: '#00CC66',
      contrastText: '#000000',
    },
    background: {
      default: '#001100',
      paper: '#002200',
    },
    text: {
      primary: '#E6FFE6',
      secondary: '#99FF99',
    },
    error: {
      main: '#FF4444',
    },
    warning: {
      main: '#FFAA00',
    },
    info: {
      main: '#00AAFF',
    },
    success: {
      main: '#00FF00',
    },
    divider: 'rgba(0, 255, 0, 0.12)',
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: '#00FF00',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#00CC00',
          },
        },
        outlined: {
          borderColor: 'rgba(0, 255, 0, 0.5)',
          color: '#00FF00',
          '&:hover': {
            borderColor: '#00FF00',
            backgroundColor: 'rgba(0, 255, 0, 0.08)',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00FF00',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 255, 0, 0.5)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 255, 0, 0.16)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.24)',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)',
          border: '1px solid rgba(0, 255, 0, 0.2)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 0 15px rgba(0, 255, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 15px rgba(0, 255, 0, 0.2)',
          backgroundImage: 'none',
          backgroundColor: '#002200',
          borderBottom: '1px solid rgba(0, 255, 0, 0.2)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            color: '#E6FFE6',
            backgroundColor: '#003300',
            borderBottom: '2px solid rgba(0, 255, 0, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 255, 0, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 255, 0, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00FF00',
              boxShadow: '0 0 5px rgba(0, 255, 0, 0.3)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderColor: 'rgba(0, 255, 0, 0.3)',
        },
      },
    },
  },
});