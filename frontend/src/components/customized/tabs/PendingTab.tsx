import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequestPending } from '@/lib/friend/friend-request-list.ts';
import { acceptFriendRequest, rejectFriendRequest } from '@/lib/friend/useFriendRequestActions.ts';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';

type PendingTabProps = {
  searchText: string;
};

export default function PendingTab({ searchText }: PendingTabProps) {
  const queryClient = useQueryClient();

  const { data: friendPending } = useQuery({
    queryKey: ['listPending'],
    queryFn: getRequestPending,
  });

  const acceptFriendMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast('Successfully accepted friend!');
      queryClient.invalidateQueries({ queryKey: ['listPending'] });
      queryClient.invalidateQueries({ queryKey: ['listFriends'] });
    },
    onError: () => {
      toast('Fail accept friend!');
    },
  });

  const rejectFriendMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast('Successfully rejected friend!');
      queryClient.invalidateQueries({ queryKey: ['listPending'] });
    },
    onError: () => {
      toast('Fail reject friend!');
    },
  });

  const handleAccept = (userId: number) => {
    acceptFriendMutation.mutate(userId);
  };

  const handleDecline = (userId: number) => {
    rejectFriendMutation.mutate(userId);
  };

  const filteredList = friendPending?.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div>
      {filteredList?.map((pendingRequest, index) => (
        <div 
          key={index}
          className="flex justify-between items-center p-3 w-full rounded hover:cursor-pointer bg-accent hover:opacity-85"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={pendingRequest.picture} alt="Avatar" />
              <AvatarFallback>???</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold leading-none text-foreground">
                {pendingRequest.username}
              </p>
              <p className="text-sm leading-none text-foreground">{pendingRequest.name}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Check
              className="w-5 h-auto cursor-pointer hover:opacity-70"
              onClick={() => handleAccept(pendingRequest.id)}
            />
            <X
              className="w-5 h-auto cursor-pointer hover:opacity-70"
              onClick={() => handleDecline(pendingRequest.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
