import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFriendList } from '@/lib/friend/friend-request-list.ts';
import { removeFriend } from '@/lib/friend/useFriendRequestActions.ts';
import { toast } from 'sonner';
import { Mail, Trash2 } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { inviteToGame } from '@/lib/friend/invite';
import { extractErrorDetail } from '@/lib/utils';

type FriendsTabProps = {
  searchText: string;
};

export default function FriendsTab({ searchText }: FriendsTabProps) {
  const queryClient = useQueryClient();

  const { data: friendList } = useQuery({
    queryKey: ['listFriends'],
    queryFn: getFriendList,
  });

  const removeFriendMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast('Successfully removed friend!');
      queryClient.invalidateQueries({ queryKey: ['listFriends'] });
    },
    onError: (e) => {
      toast('Failed to remove friend', {
        description: extractErrorDetail(e),
      });
    },
  });

  const inviteFriendMutation = useMutation({
    mutationFn: inviteToGame,
    onSuccess: () => {
      toast.info('Successfully invited friend to game!');
    },
    onError: (e: any) => {
      toast.error('Failed to invite friend to game!', {
        description: extractErrorDetail(e),
      });
    },
  });

  const inviteFriend = (userId: number) => {
    inviteFriendMutation.mutate(userId);
  };

  const handleRemove = (userId: number) => {
    removeFriendMutation.mutate(userId);
  };

  const filteredList = friendList?.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div>
      {filteredList?.map((friend, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-3 w-full rounded hover:cursor-pointer bg-accent hover:opacity-85"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={friend.picture} alt="Avatar" />
              <AvatarFallback>???</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold leading-none text-foreground">
                {friend.username}
              </p>
              <p className="text-sm leading-none text-foreground">
                {friend.name}
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-center items-center h-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Mail className="h-auto cursor-pointer hover:opacity-70 size-5" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Do you want to invite your friend to a game?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => inviteFriend(friend.id)}>
                    Invite
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Trash2
                  className="cursor-pointer hover:opacity-70 size-5"
                  onClick={() => handleRemove(friend.id)}
                />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Do you want to remove this friend?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  This action can't be undone, and you will lose your friend!
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button onClick={() => removeFriend(friend.id)}>
                      Remove
                    </Button>
                    Remv
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
