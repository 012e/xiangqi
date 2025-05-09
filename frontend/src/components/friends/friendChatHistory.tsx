import React, { useState } from 'react';
import chatHistory from '@/dummyData/chatHistory.json';
import { FaPlus, FaImage, FaFile, FaSmile, FaThumbsUp } from 'react-icons/fa';
import MessageBubble from './messageBubble';

const FriendChatHistory: React.FC = () => {
  const [message, setMessage] = useState('');

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
    <div className="flex-3 p-4 bg-card text-card-foreground border border-border rounded-lg">
      <div className="flex items-center p-4 border-b border-gray-300">
        <img
          src="https://placehold.co/50"
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <span className="font-bold text-lg">{chatData.sender}</span>
      </div>

      <div className="max-h-[calc(100vh-280px)] overflow-y-auto border border-gray-200 mb-4 p-4">
        {chatData.messages.map((msg, index) => (
          <MessageBubble
            key={index}
            type={msg.type}
            content={msg.content}
            isSentByUser={true}
          />
        ))}
      </div>

      <div className="flex items-center p-4 gap-4 border-t border-gray-300">
        <button onClick={handleIconClick} className="text-gray-500">
          <FaPlus />
        </button>
        <button onClick={handleIconClick} className="text-gray-500">
          <FaImage />
        </button>
        <button onClick={handleIconClick} className="text-gray-500">
          <FaFile />
        </button>
        <button onClick={handleIconClick} className="text-gray-500">
          <FaSmile />
        </button>
        <input
          type="text"
          placeholder="Aa"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button onClick={handleIconClick} className="text-gray-500">
          <FaSmile />
        </button>
        <button onClick={handleIconClick} className="text-gray-500">
          <FaThumbsUp />
        </button>
      </div>
    </div>
  );
};

export default FriendChatHistory;