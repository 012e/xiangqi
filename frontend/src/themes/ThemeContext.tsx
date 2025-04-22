import { createContext, useContext, useState, ReactNode } from 'react';
import { themes, Theme, ThemeName } from './themes';

interface ThemeContextType {
  theme: Theme;
  setThemeByName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const theme = themes[themeName];

  const setThemeByName = (name: ThemeName) => {
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeByName }}>
      <div style={{ backgroundColor: theme.colors.background, color: theme.colors.text, minHeight: '100vh' }}>
        {children}
      </div>
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
