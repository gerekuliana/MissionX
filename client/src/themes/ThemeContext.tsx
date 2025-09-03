import React, { ReactNode, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from './index';
import { ThemeContext, ThemeMode } from './themeContextDefinition';


export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return (savedTheme as ThemeMode) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
