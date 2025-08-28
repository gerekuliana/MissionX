import { createTheme } from '@mui/material';

export const neonPinkyDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#000000',
    },
    secondary: {
      main: '#a855f7',
      light: '#c084fc',
      dark: '#9333ea',
      contrastText: '#000000',
    },
    background: {
      default: '#0F172A', // Slate-900
      paper: '#1E293B', // Slate-800
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8', // Slate-400
    },
    error: {
      main: '#EF4444', // Red-500
    },
    warning: {
      main: '#F59E0B', // Amber-500
    },
    info: {
      main: '#3B82F6', // Blue-500
    },
    success: {
      main: '#10B981', // Emerald-500
    },
    divider: '#334155', // Slate-700
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
          boxShadow: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          background: 'linear-gradient(to right, #ec4899, #db2777)',
          '&:hover': {
            background: 'linear-gradient(to right, #db2777, #be185d)',
          },
        },
        outlined: {
          borderColor: '#ec4899',
          color: '#ec4899',
          '&:hover': {
            borderColor: '#db2777',
            color: '#db2777',
            backgroundColor: 'rgba(219, 39, 119, 0.04)',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ec4899',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ec4899',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(236, 72, 153, 0.2)',
          },
          '&:hover': {
            backgroundColor: 'rgba(236, 72, 153, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #334155',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#334155',
            },
            '&:hover fieldset': {
              borderColor: '#ec4899',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ec4899',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});