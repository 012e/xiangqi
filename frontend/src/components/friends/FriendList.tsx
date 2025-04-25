import React from 'react';
import { createGlobalStyles, createFriendsStyles } from '@/styles';
import { useTheme } from '@/themes/ThemeContext';

interface Friend {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  status: string;
  lastMessage: string;
  lastMessageTime: string;
}

interface FriendListProps {
  friends: Friend[];
  onSelectFriend: (friendName: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, onSelectFriend }) => {
  const { theme } = useTheme();
  const friendsStyles = createFriendsStyles(theme);
  const globalStyles = createGlobalStyles(theme);

  return (
    <div style={friendsStyles.friendListContainer}>
      <input
        type="text"
        placeholder="Search Messenger"
        style={friendsStyles.searchFriendInputField}
      />
      <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', ...globalStyles.friendListDisplay }}>
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              style={friendsStyles.friendItem}
              onClick={() =>
                onSelectFriend(`${friend.firstName} ${friend.lastName}`)
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = theme.colors.item)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              <img
                src={friend.image || 'https://placehold.co/50'}
                alt={`${friend.firstName} ${friend.lastName}`}
                style={friendsStyles.friendImage}
              />
              <div style={friendsStyles.friendDetails}>
                <div
                  style={friendsStyles.friendName}
                >{`${friend.firstName} ${friend.lastName}`}</div>
                <div style={friendsStyles.friendLastMessage}>
                  {friend.lastMessage}
                </div>
              </div>
              <div style={friendsStyles.friendLastMessageTime}>
                {friend.lastMessageTime}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;
