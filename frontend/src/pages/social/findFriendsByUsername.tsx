import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import AddFriendRow from '@/components/addFriendRow';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { findFriendByUsername } from '@/lib/friend/find-friend.ts';
import { postAddFriend } from '@/lib/friend/useFriendRequestActions.ts';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input.tsx';
import { getFriendList } from '@/lib/friend/friend-request-list.ts';
import { getProfileMe } from '@/stores/profile-me.ts';

const FindFriendsByUsername: React.FC = () => {
  const { data: myProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileMe,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const {data: listFriend} = useQuery(
    {
      queryKey: [`listFriends`],
      queryFn: getFriendList
    }
  )
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: usersList, isLoading, error } = useQuery({
    queryKey: ['findFriendList', debouncedSearchTerm],
    queryFn: () => findFriendByUsername(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm && debouncedSearchTerm.length > 0,
  });

  const addFriendMutation = useMutation({
    mutationFn: postAddFriend,
    onSuccess: () => {
      toast.success('Friend request sent successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to send friend request: ${error.message}`);
    },
  });
  function isMyInfo(userId: number): boolean {
    return userId === myProfile?.id;
  }
  const handleAddFriend = (userId: number) => {
    if (isMyInfo(userId)) {
      toast.error('You cannot add yourself as a friend');
      return;
    }
    addFriendMutation.mutate(userId);
  };
  const navigate = useNavigate();
  return (
    <div className="w-full text-foreground">
      <main className="p-8 m-4 bg-card text-card-foreground rounded-lg border border-border">
        <div className="flex gap-2">
          <div className="hover:cursor-pointer hover:opacity-80"
                onClick={() => navigate('/social/friend')}>
            <span>
              <ChevronLeft className="w-8 h-auto"/>
            </span>
          </div>
        <h1 className="text-2xl font-bold mb-4">Add friend by Username</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Ô tìm kiếm */}
          <div className="rounded flex items-center px-3 py-2 w-full">
            <FaSearch className="text-accent-foreground mr-2" />
            <Input
              type="text"
              placeholder="Enter Username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-accent-foreground placeholder-accent-foreground w-full"
            />
          </div>

          {/* Danh sách bạn bè sau khi lọc */}
          {searchTerm && !debouncedSearchTerm && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Type to search for users...</p>
            </div>
          )}
          
          {debouncedSearchTerm && (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {isLoading && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Searching for users...</p>
                </div>
              )}
              
              {error && (
                <div className="text-center py-4">
                  <p className="text-sm text-destructive">Error: {(error as Error).message}</p>
                </div>
              )}
              
              {usersList && usersList.content.map((user) => (
                <AddFriendRow
                  key={user.id}
                  user={user}
                  avatarUrl={user.picture || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'}
                  username={user.username}
                  email={user.email}
                  listFriend={listFriend}
                  isMe={isMyInfo(user.id)}
                  onAddFriendClick={() => handleAddFriend(user.id)}
                  onAcceptClick={() => console.log(`Accept ${user.username}`)}
                  onDeclineClick={() => console.log(`Cancel ${user.username}`)}
                />
              ))}

              {usersList && usersList.content.length === 0 && !isLoading && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users found matching "{debouncedSearchTerm}".
                </p>
              )}
            </div>
          )}
          {!searchTerm && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Enter a username to search for friends</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FindFriendsByUsername;
