import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { neonDarkGreenTheme } from '../themes/neonDarkGreen';
import { neonPinkyDarkTheme } from '../themes/neonPinkyDark';

export type ThemeName = 'neonDarkGreen' | 'neonPinkyDark';

interface ThemeContextType {
  themeName: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'selectedTheme';

const themes = {
  neonDarkGreen: neonDarkGreenTheme,
  neonPinkyDark: neonPinkyDarkTheme,
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    return savedTheme && savedTheme in themes ? savedTheme : 'neonDarkGreen';
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [themeName]);

  const toggleTheme = () => {
    setThemeName((prevTheme) =>
      prevTheme === 'neonDarkGreen' ? 'neonPinkyDark' : 'neonDarkGreen',
    );
  };

  const contextValue = useMemo(
    () => ({
      themeName,
      toggleTheme,
    }),
    [themeName],
  );

  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};