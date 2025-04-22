import React from 'react';

interface Friend {
  id: number;
  name: string;
  status: string;
}

interface FriendListProps {
  friends: Friend[];
    onSelectFriend: (friendName: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({ friends, onSelectFriend }) => {
  return (
    <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
      <h3>Danh sách bạn bè</h3>
      <ul>
        {friends.map((friend) => (
          <li
            key={friend.id}
            style={{
              cursor: 'pointer',
              color: friend.status === 'online' ? 'green' : 'gray',
            }}
            onClick={() => onSelectFriend(friend.name)}
          >
            {friend.name} ({friend.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;