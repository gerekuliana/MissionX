import { createTheme } from '@mui/material';

export const neonPinkyDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF4DFF',
      light: '#FF99FF',
      dark: '#CC00CC',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FF99FF',
      light: '#FFCCFF',
      dark: '#CC66CC',
      contrastText: '#000000',
    },
    background: {
      default: '#0B0010',
      paper: '#140019',
    },
    text: {
      primary: '#FFE6FF',
      secondary: '#FF99FF',
    },
    error: {
      main: '#FF4444',
    },
    warning: {
      main: '#FFAA00',
    },
    info: {
      main: '#AA88FF',
    },
    success: {
      main: '#FF88DD',
    },
    divider: 'rgba(255, 77, 255, 0.12)',
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
          boxShadow: '0 0 10px rgba(255, 77, 255, 0.3)',
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 0 20px rgba(255, 77, 255, 0.5)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: '#FF4DFF',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#CC00CC',
          },
        },
        outlined: {
          borderColor: 'rgba(255, 77, 255, 0.5)',
          color: '#FF4DFF',
          '&:hover': {
            borderColor: '#FF4DFF',
            backgroundColor: 'rgba(255, 77, 255, 0.08)',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FF4DFF',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 77, 255, 0.5)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 77, 255, 0.16)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(255, 77, 255, 0.24)',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 77, 255, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 0 20px rgba(255, 77, 255, 0.1)',
          border: '1px solid rgba(255, 77, 255, 0.2)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 0 15px rgba(255, 77, 255, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 15px rgba(255, 77, 255, 0.2)',
          backgroundImage: 'none',
          backgroundColor: '#140019',
          borderBottom: '1px solid rgba(255, 77, 255, 0.2)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            color: '#FFE6FF',
            backgroundColor: '#1A0020',
            borderBottom: '2px solid rgba(255, 77, 255, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 77, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 77, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF4DFF',
              boxShadow: '0 0 5px rgba(255, 77, 255, 0.3)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderColor: 'rgba(255, 77, 255, 0.3)',
        },
      },
    },
  },
});