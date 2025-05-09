import { createContext, useContext, ReactNode } from 'react';

type ThemeName = 'light' | 'dark' | 'pinkRomance' | 'blueChill' | 'greenForest';

interface ThemeContextType {
  setThemeByName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_NAMES: ThemeName[] = ['light', 'dark', 'pinkRomance', 'blueChill', 'greenForest'];

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const setThemeByName = (name: ThemeName) => {
    document.documentElement.classList.remove(...THEME_NAMES);
    document.documentElement.classList.add(name);
  };

  return (
    <ThemeContext.Provider value={{ setThemeByName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};