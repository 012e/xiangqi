import { CSSProperties } from 'react';
import { Theme } from '../themes/themes';

const createPopupStyles = (theme: Theme): Record<string, CSSProperties> => {
  return {
    containerSuccess: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#d4edda',
      border: '1px solid #c3e6cb',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      zIndex: 1000,
    },

    containerError: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      zIndex: 1000,
    },

    titleSuccess: {
      color: '#155724',
      marginBottom: '10px',
    },

    titleError: {
      color: '#721c24',
      marginBottom: '10px',
    },

    messageSuccess: {
      color: '#155724',
    },

    messageError: {
      color: '#721c24',
    },

    buttonSuccess: {
      marginTop: '15px',
      padding: '10px 20px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },

    buttonError: {
      marginTop: '15px',
      padding: '10px 20px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };
};

export default createPopupStyles;