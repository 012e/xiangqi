import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FriendsTab from './FriendsTab';
import SentTab from './SentTab';
import PendingTab from './PendingTab';
import SuggestionsTab from './SuggestionsTab';

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
  // Get current user profile
  const { data: myProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileMe,
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

  const { data: friendSuggestions } = useQuery({
    queryKey: ['listSuggestions'],
    queryFn: getSuggestion,
  });

  const addFriendMutation = useMutation({
    mutationFn: addFriend,
    onSuccess: () => {
      toast('Successfully added friend!');
    },
    onError: () => {
      toast('Fail add friend!');
    },
  });

  const rejectFriendMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast('Successfully rejected friend!');
    },
    onError: () => {
      toast('Fail reject friend!');
    },
  });

  const acceptFriendMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast('Successfully accepted friend!');
    },
    onError: () => {
      toast('Fail accept friend!');
    },
  });

  const removeFriendMutation = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast('Successfully removed friend!');
    },
    onError: () => {
      toast('Fail remove friend!');
    },
  });
  // const cancelFriend = useMutation({
  //   mutationFn: postCancelFriend,
  //   onSuccess: () => {
  //     toast('Successfully canceled friend request!');
  //   },
  //   onError: () => {
  //     toast('Failed to cancel friend request!');
  //   },
  // });

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

  return (
    <Tabs defaultValue={tabs[0].value} className="w-full">
      <TabsList className="justify-start p-0 w-full h-auto rounded-xl border-b bg-background">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="font-semibold font-sans rounded-xl bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <p className="text-md">{tab.name}</p>
          </TabsTrigger>
        ))}
      </TabsList>

      {[
        { value: 'pending', list: friendPending },
        { value: 'sent', list: friendSent },
        { value: 'friend', list: friendList },
        { value: 'suggestions', list: filteredSuggestions },
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
                  onAddFriendClick={addFriendMutation}
                  onAccept={acceptFriendMutation}
                  onDecline={rejectFriendMutation}
                  onRemove={removeFriendMutation}
                  // onCancel={cancelFriend}
                />
              </div>
            ))}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

