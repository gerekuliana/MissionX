import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'neon-green' | 'neon-pink';

export interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = 'app_theme';