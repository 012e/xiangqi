import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FriendsTab from './FriendsTab';
import SentTab from './SentTab';
import PendingTab from './PendingTab';
import SuggestionsTab from './SuggestionsTab';

export type TabFriend = {
  name: string;
  value: string;
  content: React.ReactElement;
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

      <TabsContent value="friend">
        <FriendsTab searchText={searchText} />
      </TabsContent>

      <TabsContent value="sent">
        <SentTab searchText={searchText} />
      </TabsContent>

      <TabsContent value="pending">
        <PendingTab searchText={searchText} />
      </TabsContent>

      <TabsContent value="suggestions">
        <SuggestionsTab searchText={searchText} />
      </TabsContent>
    </Tabs>
  );
}
