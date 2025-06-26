import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactElement } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getFriendList,
  getRequestPending,
  getRequestSent,
} from '@/lib/friend/friend-request-list.ts';
import UserRow from '@/components/userRow.tsx';
import {
  removeFriend,
  acceptFriendRequest,
  addFriend,
  rejectFriendRequest,
} from '@/lib/friend/useFriendRequestActions.ts';
import { toast } from 'sonner';
export type TabFriend = {
  name: string;
  value: string;
  content: ReactElement;
};
const tabs = [
  {
    name: 'Friend',
    value: 'friend',
  },
  {
    name: 'Sent',
    value: 'sent',
  },
  {
    name: 'Pending',
    value: 'pending',
  },
  {
    name: 'Suggestions',
    value: 'suggestions',
  },
];
type TabsFriendProps = {
  searchText: string;
};
export default function TabsFriend({ searchText }: TabsFriendProps) {
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

  const addFriendMutate = useMutation({
    mutationFn: addFriend,
    onSuccess: () => {
      toast('Successfully added friend!');
    },
    onError: () => {
      toast('Fail add friend!');
    },
  });
  const rejectFriend = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast('Successfully rejected friend!');
    },
    onError: () => {
      toast('Fail reject friend!');
    },
  });
  const acceptFriend = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast('Successfully accepted friend!');
    },
    onError: () => {
      toast('Fail accept friend!');
    },
  });
  const removeFriendMutate = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast('Successfully removed friend!');
    },
    onError: () => {
      toast('Fail remove friend!');
    },
  });
  return (
    <Tabs defaultValue={tabs[0].value} className="w-full">
      <TabsList className="justify-start p-0 w-full h-auto rounded-none border-b bg-background">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="font-semibold font-mono rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <code className="text-md">{tab.name}</code>
          </TabsTrigger>
        ))}
      </TabsList>

      {[
        { value: 'pending', list: friendPending },
        { value: 'sent', list: friendSent },
        { value: 'friend', list: friendList },
      ].map(({ value, list }) => {
        const filteredList = list?.filter((user) =>
          user.username.toLowerCase().includes(searchText.toLowerCase()),
        );

        return (
          <TabsContent value={value} key={value}>
            {filteredList?.map((item, index) => (
              <div className="flex gap-2" key={index}>
                <UserRow
                  userId={item.id}
                  typeTab={value}
                  username={item.username}
                  displayName={item.name}
                  avatarUrl={item.picture}
                  onAddFriendClick={addFriendMutate}
                  onAccept={acceptFriend}
                  onDecline={rejectFriend}
                  onRemove={removeFriendMutate}
                />
              </div>
            ))}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
