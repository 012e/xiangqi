import { CSSProperties } from 'react';
import { Theme } from '../themes/themes';

const createSettingsStyles = (theme: Theme): Record<string, CSSProperties> => {
  return {
    profileEditContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      flexWrap: 'wrap',
    },

    avatar: {
      flex: '1 1 150px',
      maxWidth: '150px',
      textAlign: 'center',
      padding: '10px',
      border: `1px solid ${theme.colors.item}`,
      borderRadius: '10px',
    },

    avatarImage: {
      width: '100%',
      height: 'auto',
      borderRadius: '50%',
      boxShadow: theme.colors.background === '#ffffff'
        ? '0 4px 6px rgba(0, 0, 0, 0.1)'
        : '0 4px 6px rgba(255, 255, 255, 0.1)',
    },

    bio: {
      flex: '2 1 300px',
      padding: '10px',
      border: `1px solid ${theme.colors.item}`,
      borderRadius: '10px',
    },
  };
};

export default createSettingsStyles;