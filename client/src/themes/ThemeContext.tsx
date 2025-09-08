import React, { ReactNode, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './index';
import { neonDarkGreenTheme } from './neonDarkGreenTheme';
import { neonPinkyDarkTheme } from './neonPinkyDarkTheme';
import { ThemeContext, ThemeMode, THEME_STORAGE_KEY } from './context';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
    const validThemes: ThemeMode[] = ['light', 'dark', 'neon-green', 'neon-pink'];
    return validThemes.includes(savedTheme) ? savedTheme : 'neon-green';
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prevMode => {
      if (prevMode === 'neon-green') return 'neon-pink';
      if (prevMode === 'neon-pink') return 'neon-green';
      return prevMode === 'light' ? 'dark' : 'light';
    });
  };

  const setTheme = (theme: ThemeMode) => {
    setThemeMode(theme);
  };

  const theme = useMemo(() => {
    switch (themeMode) {
      case 'light':
        return lightTheme;
      case 'dark':
        return darkTheme;
      case 'neon-green':
        return neonDarkGreenTheme;
      case 'neon-pink':
        return neonPinkyDarkTheme;
      default:
        return neonDarkGreenTheme;
    }
  }, [themeMode]);

  const contextValue = useMemo(() => ({
    themeMode,
    toggleTheme,
    setTheme,
  }), [themeMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
