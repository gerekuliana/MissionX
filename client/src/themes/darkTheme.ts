import { createTheme, Theme } from '@mui/material';

/**
 * Validates if a string is a valid hex color code
 */
const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(color);
};

/**
 * Validates if a string is a valid RGBA color
 */
const isValidRgbaColor = (color: string): boolean => {
  return /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/.test(color);
};

/**
 * Validates color value and returns it or a fallback
 */
const validateColor = (color: string, fallback: string): string => {
  try {
    if (!color || typeof color !== 'string') {
      console.warn(`Invalid color value: ${color}, using fallback: ${fallback}`);
      return fallback;
    }
    if (isValidHexColor(color) || isValidRgbaColor(color)) {
      return color;
    }
    console.warn(`Invalid color format: ${color}, using fallback: ${fallback}`);
    return fallback;
  } catch (error) {
    console.error(`Error validating color: ${error}`, { color, fallback });
    return fallback;
  }
};

// Primary button colors (dark green)
const PRIMARY_COLORS = {
  main: validateColor('#66BB6A', '#90CAF9'),
  light: validateColor('#81C784', '#A5D6F1'),
  dark: validateColor('#388E3C', '#42A5F5'),
  contrastText: validateColor('#000000', '#FFFFFF'),
};

/**
 * Creates the dark theme with error handling
 */
const createDarkTheme = (): Theme => {
  try {
    return createTheme({
  palette: {
    mode: 'dark',
    primary: PRIMARY_COLORS,
    secondary: {
      main: validateColor('#9CA3AF', '#9CA3AF'),
      light: validateColor('#D1D5DB', '#D1D5DB'),
      dark: validateColor('#6B7280', '#6B7280'),
      contrastText: validateColor('#000000', '#FFFFFF'),
    },
    background: {
      default: validateColor('#121212', '#121212'),
      paper: validateColor('#1E1E1E', '#1E1E1E'),
    },
    text: {
      primary: validateColor('#FFFFFF', '#FFFFFF'),
      secondary: validateColor('#B3B3B3', '#B3B3B3'),
    },
    error: {
      main: validateColor('#F87171', '#F44336'),
    },
    warning: {
      main: validateColor('#FBBF24', '#FF9800'),
    },
    info: {
      main: validateColor('#60A5FA', '#2196F3'),
    },
    success: {
      main: validateColor('#34D399', '#4CAF50'),
    },
    divider: validateColor('rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.12)'),
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
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundColor: PRIMARY_COLORS.main,
          color: PRIMARY_COLORS.contrastText,
          '&:hover': {
            backgroundColor: PRIMARY_COLORS.dark,
          },
        },
        outlined: {
          borderColor: validateColor('rgba(255, 255, 255, 0.23)', 'rgba(255, 255, 255, 0.23)'),
          color: PRIMARY_COLORS.main,
          '&:hover': {
            borderColor: PRIMARY_COLORS.main,
            backgroundColor: validateColor('rgba(102, 187, 106, 0.08)', 'rgba(102, 187, 106, 0.08)'),
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY_COLORS.main,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: validateColor('rgba(255, 255, 255, 0.23)', 'rgba(255, 255, 255, 0.23)'),
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: validateColor('rgba(102, 187, 106, 0.16)', 'rgba(102, 187, 106, 0.16)'),
          },
          '&.Mui-selected:hover': {
            backgroundColor: validateColor('rgba(102, 187, 106, 0.24)', 'rgba(102, 187, 106, 0.24)'),
          },
          '&:hover': {
            backgroundColor: validateColor('rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.08)'),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
          backgroundImage: 'none',
          backgroundColor: '#1E1E1E',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            color: '#FFFFFF',
            backgroundColor: '#2A2A2A',
            borderBottom: '2px solid rgba(255, 255, 255, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: validateColor('rgba(255, 255, 255, 0.23)', 'rgba(255, 255, 255, 0.23)'),
            },
            '&:hover fieldset': {
              borderColor: validateColor('rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.4)'),
            },
            '&.Mui-focused fieldset': {
              borderColor: PRIMARY_COLORS.main,
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
  });
  } catch (error) {
    console.error('Error creating dark theme:', error);
    // Return a minimal fallback theme in case of error
    return createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#90CAF9',
          contrastText: '#FFFFFF',
        },
      },
    });
  }
};

/**
 * Dark theme with primary button colors set to dark green
 * Includes error handling and color validation
 */
export const darkTheme = (() => {
  try {
    return createDarkTheme();
  } catch (error) {
    console.error('Fatal error creating dark theme, using emergency fallback:', error);
    // Emergency fallback - create absolute minimal theme
    return createTheme({
      palette: {
        mode: 'dark',
      },
    });
  }
})();