import React, { useState } from 'react';
import { createGlobalStyles } from '../../styles';
import { useTheme } from '@/themes/ThemeContext';
import { AddFriendForm, FriendList, FriendMessage } from '@/components/friends';
import friendsData from '@/data/friends.json';

const Friends: React.FC = () => {
  const { theme } = useTheme();
  const globalStyles = createGlobalStyles(theme);

  const [messages, setMessages] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const handleSendMessage = (message: string) => {
    if (selectedFriend) {
      setMessages((prev) => [...prev, `${selectedFriend}: ${message}`]);
    }
  };

  return (
    <div className="social-friend w-screen">
    <main style={globalStyles.container}>
      <h1 style={globalStyles.titleContainer}>Bạn bè</h1>
      <AddFriendForm />
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <FriendList
          friends={friendsData}
          onSelectFriend={(friend) => setSelectedFriend(friend)}
        />
        <FriendMessage
          selectedFriend={selectedFriend}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </main></div>
  );
};

export default Friends;