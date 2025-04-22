// Colors
export const colors = {
  primary: '#0070f3',
  success: '#4CAF50',
  danger: '#f44336',
  warning: '#FFC107',
  info: '#17A2B8',
  light: '#f5f5f5',
  dark: '#302E2B',
  gray: '#ccc',
  textPrimary: '#333',
  textSecondary: '#555',
  background: '#ffffff',
};

// Font Sizes
export const fontSizes = {
  small: '12px',
  medium: '16px',
  large: '20px',
  xLarge: '24px',
  xxLarge: '32px',
  titlePage: '36px',
  titleSection: '26px',
};

// Font Weights
export const fontWeights = {
  normal: 400,
  bold: 700,
};

// Shadows
export const shadows = {
  light: '0 2px 4px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 8px rgba(0, 0, 0, 0.2)',
  heavy: '0 8px 16px rgba(0, 0, 0, 0.3)',
};

// Border Radius
export const borderRadius = {
  small: '4px',
  medium: '8px',
  large: '12px',
};

export type ThemeName = 'light' | 'dark' | 'pinkRomance' | 'blueChill';

export interface Theme {
  name: ThemeName;
  colors: {
    background: string;
    text: string;
    main: string;
    container: string;
    item: string;
    buttonCTA: {
      bg: string;
      text: string;
    };
    buttonGhost: {
      bg: string;
      text: string;
    };
  };
}
export const themes: Record<ThemeName, Theme> = {
  light: {
    name: 'light',
    colors: {
      background: '#ffffff',
      text: '#000000',
      main: '#f5f5f5',
      container: '#f6f6f6',
      item: '#eeeeee',
      buttonCTA: { bg: '#0070f3', text: '#f6f6f6' },
      buttonGhost: { bg: '#f5f5f5', text: '#373632' },
    },
  },
  dark: {
    name: 'dark',
    colors: {
      background: '#2f2e2a',
      text: '#f3f3f0',
      main: '#373632',
      container: '#262521',
      item: '#373632',
      buttonCTA: { bg: '#5e9849', text: '#f3f3f0' },
      buttonGhost: { bg: '#373632', text: '#f3f3f0' },
    },
  },
  pinkRomance: {
    name: 'pinkRomance',
    colors: {
      background: '#ffe6f0',
      text: '#a30050',
      main: '#ffcce0',
      container: '#ff99cc',
      item: '#ffb3d9',
      buttonCTA: { bg: '#ff4da6', text: '#ffffff' },
      buttonGhost: { bg: '#ffcce0', text: '#a30050' },
    },
  },
  blueChill: {
    name: 'blueChill',
    colors: {
      background: '#e0f7fa',
      text: '#006064',
      main: '#b2ebf2',
      container: '#4dd0e1',
      item: '#80deea',
      buttonCTA: { bg: '#00acc1', text: '#ffffff' },
      buttonGhost: { bg: '#b2ebf2', text: '#006064' },
    },
  },
};