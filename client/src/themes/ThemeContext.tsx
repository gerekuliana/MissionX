import React, { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { darkTheme } from './index';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <MuiThemeProvider theme={darkTheme}>{children}</MuiThemeProvider>;
};
