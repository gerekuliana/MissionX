import { createContext } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);