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
  main: validateColor('#2E7D32', '#1976d2'),
  light: validateColor('#4CAF50', '#42a5f5'),
  dark: validateColor('#1B5E20', '#1565c0'),
  contrastText: validateColor('#FFFFFF', '#FFFFFF'),
};

/**
 * Creates the light theme with error handling
 */
const createLightTheme = (): Theme => {
  try {
    return createTheme({
  palette: {
    mode: 'light',
    primary: PRIMARY_COLORS,
    secondary: {
      main: validateColor('#6B7280', '#6B7280'),
      light: validateColor('#9CA3AF', '#9CA3AF'),
      dark: validateColor('#4B5563', '#4B5563'),
      contrastText: validateColor('#FFFFFF', '#FFFFFF'),
    },
    background: {
      default: validateColor('#F5F5F5', '#F5F5F5'),
      paper: validateColor('#FFFFFF', '#FFFFFF'),
    },
    text: {
      primary: validateColor('#1F2937', '#1F2937'),
      secondary: validateColor('#6B7280', '#6B7280'),
    },
    error: {
      main: validateColor('#EF4444', '#f44336'),
    },
    warning: {
      main: validateColor('#F59E0B', '#ff9800'),
    },
    info: {
      main: validateColor('#3B82F6', '#2196f3'),
    },
    success: {
      main: validateColor('#10B981', '#4caf50'),
    },
    divider: validateColor('rgba(0, 0, 0, 0.12)', 'rgba(0, 0, 0, 0.12)'),
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
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
          },
        },
        outlined: {
          borderColor: validateColor('rgba(0, 0, 0, 0.23)', 'rgba(0, 0, 0, 0.23)'),
          '&:hover': {
            borderColor: PRIMARY_COLORS.main,
            backgroundColor: validateColor('rgba(46, 125, 50, 0.04)', 'rgba(46, 125, 50, 0.04)'),
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
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: validateColor('rgba(46, 125, 50, 0.08)', 'rgba(46, 125, 50, 0.08)'),
          },
          '&.Mui-selected:hover': {
            backgroundColor: validateColor('rgba(46, 125, 50, 0.12)', 'rgba(46, 125, 50, 0.12)'),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 600,
            backgroundColor: '#F9FAFB',
            borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
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
    console.error('Error creating light theme:', error);
    // Return a minimal fallback theme in case of error
    return createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
          contrastText: '#FFFFFF',
        },
      },
    });
  }
};

/**
 * Light theme with primary button colors set to dark green
 * Includes error handling and color validation
 */
export const lightTheme = (() => {
  try {
    return createLightTheme();
  } catch (error) {
    console.error('Fatal error creating light theme, using emergency fallback:', error);
    // Emergency fallback - create absolute minimal theme
    return createTheme({
      palette: {
        mode: 'light',
      },
    });
  }
})();