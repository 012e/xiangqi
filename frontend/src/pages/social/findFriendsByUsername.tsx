import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import friendsData from '@/dummyData/friends.json';
import AddFriendRow from '@/components/addFriendRow';

const FindFriendsByUsername: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFriends = searchTerm
    ? friendsData.filter((friend) =>
        `${friend.firstName.toLowerCase()}_${friend.lastName.toLowerCase()}`.includes(
          searchTerm.toLowerCase(),
        ),
      )
    : [];

  return (
    <div className="w-full text-foreground">
      <main className="p-8 m-4 bg-card text-card-foreground rounded-lg border border-border">
        <h1 className="text-2xl font-bold mb-4">Tìm bạn bè bằng Username</h1>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Ô tìm kiếm */}
          <div className="bg-accent rounded hover:bg-ring border border-ring flex items-center px-3 py-2 w-full">
            <FaSearch className="text-accent-foreground mr-2" />
            <input
              type="text"
              placeholder="Nhập username cần tìm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-accent-foreground placeholder-accent-foreground w-full"
            />
          </div>

          {/* Danh sách bạn bè sau khi lọc */}
          {searchTerm && (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredFriends.map((friend) => (
                <AddFriendRow
                  key={friend.id}
                  avatarUrl={friend.image}
                  username={`${friend.firstName.toLowerCase()}_${friend.lastName.toLowerCase()}`}
                  displayName={`${friend.firstName} ${friend.lastName}`}
                  onAcceptClick={() =>
                    console.log(`Play with ${friend.firstName}`)
                  }
                  onDeclineClick={() =>
                    console.log(`Message ${friend.firstName}`)
                  }
                />
              ))}
              {filteredFriends.length === 0 && (
                <p className="text-sm text-muted">Không tìm thấy bạn nào.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FindFriendsByUsername;
