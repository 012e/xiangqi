import React from 'react';

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
  return (
    <div className="flex-1 p-4 bg-card text-card-foreground border border-border rounded-lg">
      <input
        type="text"
        placeholder="Search Messenger"
        className="w-full p-2 mb-4 rounded-full border border-gray-300 outline-none"
      />
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex justify-between items-center p-4 mb-4 rounded-lg cursor-pointer transition-colors hover:bg-gray-200 border-b border-gray-300"
              onClick={() =>
                onSelectFriend(`${friend.firstName} ${friend.lastName}`)
              }
            >
              <img
                src={friend.image || 'https://placehold.co/50'}
                alt={`${friend.firstName} ${friend.lastName}`}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <div className="font-bold text-sm">{`${friend.firstName} ${friend.lastName}`}</div>
                <div className="text-xs text-gray-600">{friend.lastMessage}</div>
              </div>
              <div className="text-xs text-gray-500">{friend.lastMessageTime}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendList;