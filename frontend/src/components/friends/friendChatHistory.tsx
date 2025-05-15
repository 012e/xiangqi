import React, { useState } from 'react';
import chatHistory from '@/dummyData/chatHistory.json';
import MessageBubble from './messageBubble';
import { File, Image, Plus, Smile, ThumbsUp } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';

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
      <div className="flex items-center p-4">
        <img
          src="https://placehold.co/50"
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <span className="font-bold text-lg">{chatData.sender}</span>
      </div>

      <div className="max-h-[calc(100vh-280px)] overflow-y-auto border-muted-foreground border mb-4 p-4">
        {chatData.messages.map((msg, index) => (
          <MessageBubble
            key={index}
            type={msg.type}
            content={msg.content}
            isSentByUser={true}
          />
        ))}
      </div>

      <div className="flex items-center py-4 border-t border-muted-foreground">
        <Button onClick={handleIconClick} className="text-foreground" variant="ghost">
          <Plus />
        </Button>
        <Button onClick={handleIconClick} className="text-foreground" variant="ghost">
          <Image />
        </Button>
        <Button onClick={handleIconClick} className="text-foreground" variant="ghost">
          <File />
        </Button>
        <Input
          placeholder="Aa"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleIconClick} className="text-foreground" variant="ghost">
          <Smile />
        </Button>
        <Button onClick={handleIconClick} className="text-foreground" variant="ghost">
          <ThumbsUp />
        </Button>
      </div>
    </div>
  );
};

export default FriendChatHistory;
