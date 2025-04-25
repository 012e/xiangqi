import React, { useState } from 'react';
import { createFriendsStyles } from '@/styles';
import { useTheme } from '@/themes/ThemeContext';

interface FriendMessageProps {
  selectedFriend: string | null;
  messages: string[];
  onSendMessage: (message: string) => void;
}

const FriendMessage: React.FC<FriendMessageProps> = ({
  selectedFriend,
  messages,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const friendsStyles = createFriendsStyles(theme);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={friendsStyles.friendMessageContainer}>
      <h3>Bạn đang nhắn tin với: {selectedFriend || '...'}</h3>
      <div style={friendsStyles.messageList}>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      {selectedFriend && (
        <div>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={friendsStyles.messageInput}
          />
          <button onClick={handleSendMessage} style={friendsStyles.sendButton}>
            Gửi
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendMessage;