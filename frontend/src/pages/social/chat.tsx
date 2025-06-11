import React, { useState } from 'react';
import {
  FriendList,
  FriendChatHistory,
} from '@/components/friends';
import friendsData from '@/dummyData/friends.json';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const handleSendMessage = (message: string) => {
    if (selectedFriend) {
      setMessages((prev) => [...prev, `${selectedFriend}: ${message}`]);
    }
  };

  return (
    <div className="w-full text-foreground">
      <main className="p-8 m-4 max-w-[800px] bg-card text-card-foreground rounded-lg border border-border">
        <h1 className="text-2xl font-bold mb-4">Bạn bè</h1>
        <div className="flex gap-4">
          <FriendList
            friends={friendsData}
            onSelectFriend={(friend) => setSelectedFriend(friend)}
          />
          <FriendChatHistory />
        </div>
      </main>
    </div>
  );
};

export default Chat;