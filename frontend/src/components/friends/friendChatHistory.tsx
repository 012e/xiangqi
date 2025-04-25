import React, { useState } from 'react';
import { createFriendsStyles } from '@/styles';
import { useTheme } from '@/themes/ThemeContext';
import chatHistory from '@/dummyData/chatHistory.json';
import { FaPlus, FaImage, FaFile, FaSmile, FaThumbsUp } from 'react-icons/fa';
import MessageBubble from './messageBubble';

const FriendChatHistory: React.FC = () => {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const friendsStyles = createFriendsStyles(theme);

  // Temporarily use the first chat history for display
  const chatData = chatHistory[0];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Message sent:', message); // Placeholder for sending message
      setMessage('');
    }
  };

  const handleIconClick = () => {
    alert('Ok');
  };

  return (
    <div style={friendsStyles.friendMessageContainer}>
      <div style={friendsStyles.chatHeader}>
        <img
          src="https://placehold.co/50"
          alt="User Avatar"
          style={friendsStyles.chatHeaderImage}
        />
        <span style={friendsStyles.chatHeaderName}>{chatData.sender}</span>
      </div>

      <div style={friendsStyles.messageList}>
        {chatData.messages.map((msg, index) => (
          <MessageBubble
            key={index}
            type={msg.type}
            content={msg.content}
            isSentByUser={true}
          />
        ))}
      </div>

      {/* Placeholder for the message input */}
      <div style={friendsStyles.messageInputContainer}>
        <button onClick={handleIconClick} style={friendsStyles.iconButton}>
          <FaPlus />
        </button>
        <button onClick={handleIconClick} style={friendsStyles.iconButton}>
          <FaImage />
        </button>
        <button onClick={handleIconClick} style={friendsStyles.iconButton}>
          <FaFile />
        </button>
        <button onClick={handleIconClick} style={friendsStyles.iconButton}>
          <FaSmile />
        </button>
        <input
          type="text"
          placeholder="Aa"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={friendsStyles.messageInput}
        />
        <button onClick={handleIconClick} style={friendsStyles.iconButton}>
          <FaSmile />
        </button>
        <button onClick={handleIconClick} style={friendsStyles.iconButton}>
          <FaThumbsUp />
        </button>
      </div>
    </div>
  );
};

export default FriendChatHistory;
