import React, { useState } from 'react';

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

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={{ flex: 2, border: '1px solid #ccc', padding: '10px' }}>
      <h3>Bạn đang nhắn tin với: {selectedFriend || '...'}</h3>
      <div
        style={{
          height: '200px',
          overflowY: 'auto',
          border: '1px solid #eee',
          marginBottom: '10px',
          padding: '10px',
        }}
      >
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
            style={{ padding: '8px', marginRight: '10px', width: '70%' }}
          />
          <button onClick={handleSendMessage} style={{ padding: '8px' }}>
            Gửi
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendMessage;