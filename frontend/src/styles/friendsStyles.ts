import { CSSProperties } from 'react';

const createFriendsStyles = (theme: any): Record<string, CSSProperties> => {
  return {
    friendListContainer: {
      padding: '20px',
      backgroundColor: theme.colors.container,
      borderRadius: '8px',
      boxShadow: theme.colors.background === '#ffffff' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(255, 255, 255, 0.1)',
    },
    friendItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      borderBottom: `1px solid ${theme.colors.item}`,
    },
    addFriendForm: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '20px',
    },
    inputField: {
      padding: '10px',
      marginBottom: '10px',
      border: `1px solid ${theme.colors.item}`,
      borderRadius: '4px',
    },
    messageArea: {
      width: '100%',
      height: '100px',
      padding: '10px',
      border: `1px solid ${theme.colors.item}`,
      borderRadius: '4px',
      resize: 'none',
    },
    sendMessageButton: {
      marginTop: '10px',
      padding: '10px',
      backgroundColor: theme.colors.buttonCTA.bg,
      color: theme.colors.buttonCTA.text,
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    //
    addFriendFormContainer: {
      justifyContent: 'space-between',
      display: 'flex',
      marginBottom: '20px',
    },
    addFriendInput: {
      flex: 1,
      padding: '8px',
      marginRight: '10px',
      border: '1px solid transparent',
      borderRadius: '4px',
      transition: 'border 0.2s ease-in-out',
      outline: 'none',
    },
  };
};

export default createFriendsStyles;