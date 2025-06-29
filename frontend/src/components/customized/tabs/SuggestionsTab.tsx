import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSuggestion } from '@/lib/friend/find-friend.ts';
import { addFriend } from '@/lib/friend/useFriendRequestActions.ts';
import { getFriendList, getRequestPending, getRequestSent } from '@/lib/friend/friend-request-list.ts';
import { getProfileMe } from '@/stores/profile-me.ts';
import { toast } from 'sonner';
import { UserPlus, CircleX } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';

type SuggestionsTabProps = {
  searchText: string;
};

export default function SuggestionsTab({ searchText }: SuggestionsTabProps) {
  const queryClient = useQueryClient();
  const [sentRequests, setSentRequests] = useState<Set<number>>(new Set());

  const { data: myProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileMe,
  });

  const { data: friendSuggestions } = useQuery({
    queryKey: ['listSuggestions'],
    queryFn: getSuggestion,
  });

  const { data: friendList } = useQuery({
    queryKey: ['listFriends'],
    queryFn: getFriendList,
  });

  const { data: friendSent } = useQuery({
    queryKey: ['listSent'],
    queryFn: getRequestSent,
  });

  const { data: friendPending } = useQuery({
    queryKey: ['listPending'],
    queryFn: getRequestPending,
  });

  const addFriendMutation = useMutation({
    mutationFn: addFriend,
    onSuccess: (_, userId) => {
      toast('Successfully added friend!');
      setSentRequests(prev => new Set(prev).add(userId));
      queryClient.invalidateQueries({ queryKey: ['listSuggestions'] });
      queryClient.invalidateQueries({ queryKey: ['listSent'] });
    },
    onError: () => {
      toast('Fail add friend!');
    },
  });

  const handleAddFriend = (userId: number) => {
    addFriendMutation.mutate(userId);
  };

  // Filter suggestions to exclude current user, friends, sent requests, and pending requests
  const filteredSuggestions = friendSuggestions?.filter((user) => {
    // Exclude current user
    if (user.id === myProfile?.id) return false;

    // Exclude users who are already friends
    if (friendList?.some((friend) => friend.id === user.id)) return false;

    // Exclude users who have sent requests (pending for us)
    if (friendPending?.some((pending) => pending.id === user.id)) return false;

    // Exclude users we've already sent requests to
    if (friendSent?.some((sent) => sent.id === user.id)) return false;

    return true;
  });

  const finalFilteredList = filteredSuggestions?.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div>
      {finalFilteredList?.map((suggestion, index) => (
        <div 
          key={index}
          className="flex justify-between items-center p-3 w-full rounded hover:cursor-pointer bg-accent hover:opacity-85"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={suggestion.picture} alt="Avatar" />
              <AvatarFallback>???</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold leading-none text-foreground">
                {suggestion.username}
              </p>
              <p className="text-sm leading-none text-foreground">{suggestion.name}</p>
            </div>
          </div>
          
          <div>
            {sentRequests.has(suggestion.id) ? (
              <CircleX className="w-5 h-auto cursor-pointer hover:opacity-70 text-muted-foreground" />
            ) : (
              <UserPlus
                className="w-5 h-auto cursor-pointer hover:opacity-70"
                onClick={() => handleAddFriend(suggestion.id)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
