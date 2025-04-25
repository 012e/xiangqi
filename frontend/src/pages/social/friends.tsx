import React, { useState } from 'react';
import { createGlobalStyles, createFriendsStyles } from '@/styles';
import { useTheme } from '@/themes/ThemeContext';
import {
  AddFriendForm,
  FriendList,
  FriendChatHistory,
} from '@/components/friends';
import friendsData from '@/dummyData/friends.json';

const Friends: React.FC = () => {
  const { theme } = useTheme();
  const friendsStyles = createFriendsStyles(theme);
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
      <main style={{...globalStyles.pageContainer}}>
        <h1 style={globalStyles.titlePage}>Bạn bè</h1>
        <div style={friendsStyles.friendsPageContainer}>
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
