import React, { useState } from 'react';
import {
  AddFriendForm,
  FriendList,
  FriendChatHistory,
} from '@/components/friends';
import friendsData from '@/dummyData/friends.json';

const Friends: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const handleSendMessage = (message: string) => {
    if (selectedFriend) {
      setMessages((prev) => [...prev, `${selectedFriend}: ${message}`]);
    }
  };

  return (
    <div className="w-screen">
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Bạn bè</h1>
        <div className="flex gap-4">
          <FriendList
            friends={friendsData.users}
            onSelectFriend={(friend) => setSelectedFriend(friend)}
          />
          <FriendChatHistory />
        </div>
      </main>
    </div>
  );
};

export default Friends;