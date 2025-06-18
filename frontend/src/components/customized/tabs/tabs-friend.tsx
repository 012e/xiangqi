import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFriendList, getRequestPending, getRequestSent } from '@/lib/friend/friend-request-list.ts';
import UserRow from '@/components/userRow.tsx';
export type TabFriend = {
  name: string;
  value: string;
  content: ReactElement;
}
const tabs = [
  {
    name: "Friend",
    value: "friend",
  },
  {
    name: "Sent",
    value: "sent",
  },
  {
    name: "Pending",
    value: "pending",
  },
  {
    name: "Suggestions",
    value: "suggestions",
  },
];

export default function TabsFriend() {
  const {data: friendList} = useQuery(
    {
      queryKey: ['listFriends'],
      queryFn: getFriendList
    }
  )
  const {data: friendSent} = useQuery({
    queryKey: ['listSent'],
    queryFn: getRequestSent
  })
  const {data: friendPending} = useQuery( {
    queryKey: ['listPending'],
    queryFn: getRequestPending
  })
  return (
    <Tabs defaultValue={tabs[0].value} className="w-full">
      <TabsList className="w-full h-auto p-0 bg-background justify-start border-b rounded-none">
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

      <TabsContent value={'pending'}>
        {friendPending?.map((pending, index) => {
          return <div className="flex gap-2" key={index}>
            <UserRow typeTab={'pending'} username={pending.username} key={index} displayName={pending.name} avatarUrl={pending.picture}></UserRow>
          </div>
        })}
      </TabsContent>

      <TabsContent value={'sent'}>
        {friendSent?.map((sent, index) => {
          return <div className="flex gap-2" key={index}>
            <UserRow typeTab={'sent'} username={sent.username} key={index} displayName={sent.name} avatarUrl={sent.picture}></UserRow>
          </div>
        })}
      </TabsContent>

      <TabsContent value={'friend'}>
        {friendList?.map((friend, index) => {
          return <div className="flex gap-2" key={index}>
            <UserRow typeTab={'friend'} username={friend.username} key={index} displayName={friend.name} avatarUrl={friend.picture}></UserRow>
          </div>
        })}
      </TabsContent>

    </Tabs>
  );
}
