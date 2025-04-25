import { CSSProperties } from 'react';

const createFriendsStyles = (theme: any): Record<string, CSSProperties> => {
  return {
    friendsPageContainer: {
      display: 'flex',
      gap: '10px',
    },

    //Friend list styles:
    friendListContainer: {
      flex: 1,
      padding: '10px',
      backgroundColor: theme.colors.container,
      border: '1px solid #ccc',
      borderRadius: '8px',
    },
    searchFriendInputField: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
      borderRadius: '20px',
      border: '1px solid #ccc',
      outline: 'none',
    },
    friendListDisplay: {
      maxHeight: 'calc(100vh - 200px)',
      overflowY: 'auto',
    },
    friendItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      borderBottom: `1px solid ${theme.colors.item}`,
    },
    friendImage: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '10px',
    },
    friendDetails: {
      flex: 1,
    },
    friendName: {
      fontWeight: 'bold',
      fontSize: '14px',
    },
    friendLastMessage: {
      fontSize: '12px',
      color: '#555',
    },
    friendLastMessageTime: {
      fontSize: '12px',
      color: '#999',
    },

    //add friend styles:
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

    //friend message styles:
    friendMessageContainer: {
      flex: 3,
      padding: '10px',
      backgroundColor: theme.colors.container,
      border: '1px solid #ccc',
      borderRadius: '8px',
    },
    messageList: {
      maxHeight: 'calc(100vh - 200px - 80px)',
      overflowY: 'auto',
      border: '1px solid #eee',
      marginBottom: '10px',
      padding: '10px',
    },
    messageInput: {
      padding: '8px',
      marginRight: '10px',
      width: '70%',
    },
    sendButton: {
      padding: '8px',
    },
    chatHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      borderBottom: '1px solid #ccc',
    },
    chatHeaderImage: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      marginRight: '10px',
    },
    chatHeaderName: {
      fontWeight: 'bold',
      fontSize: '16px',
    },
    messageInputContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      gap: '10px',
      borderTop: '1px solid #ccc',
    },
  };
};

export default createFriendsStyles;
