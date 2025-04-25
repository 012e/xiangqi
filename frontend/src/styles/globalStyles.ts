import { CSSProperties } from 'react';
import { fontSizes, Theme } from '../themes/themes';

const createGlobalStyles = (theme: Theme): Record<string, CSSProperties> => {
  return {
    pageContainer: {
      padding: '0rem 2rem 1rem',
      margin: '1rem auto',
      minWidth: '600px',
      maxWidth: '1100px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: 1.6,
      color: theme.colors.text,
      backgroundColor: theme.colors.container,
      borderRadius: '8px',
      border: `1px solid ${theme.colors.item}`,
      alignSelf: 'center',
    },

    fixedPageContainer: {
      padding: '0rem 2rem 4rem',
      margin: '1rem auto',
      minWidth: '600px',
      maxWidth: '1100px',
      maxHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      lineHeight: 1.6,
      color: theme.colors.text,
      backgroundColor: theme.colors.container,
      borderRadius: '8px',
      border: `1px solid ${theme.colors.item}`,
      alignSelf: 'center',
    },

    main: {
      padding: '20px',
      backgroundColor: theme.colors.background,
    },

    section: {
      marginBottom: '30px',
    },

    // Text styles
    titlePage: {
      fontSize: fontSizes.titlePage,
      fontWeight: 700,
      marginBottom: '5px',
      marginTop: '10px',
      color: theme.colors.text,
    },

    titleSection: {
      fontSize: fontSizes.titleSection,
      fontWeight: 700,
      marginBottom: '10px',
      marginTop: '5px',
      color: theme.colors.text,
    },

    textArea: {
      width: '100%',
      height: '80px',
      marginTop: '5px',
      padding: '10px',
      border: `1px solid ${theme.colors.item}`,
      borderRadius: '4px',
      resize: 'vertical',
    },

    // List styles
    listButtonsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'right',
      marginTop: '10px',
    },
  };
};

export default createGlobalStyles;
