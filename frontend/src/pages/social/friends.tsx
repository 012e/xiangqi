import React from 'react';
import ActionCard from '@/components/actionCard';
import { FaLink, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import TabsFriend from '@/components/customized/tabs/tabs-friend.tsx';


const Friends: React.FC = () => {
  const navigate = useNavigate();

  const handleFindById = () => {
    navigate('/social/friend/findById');
  };

  return (
    <div className="w-full text-foreground">
      <main className="p-8 m-4 bg-card text-card-foreground rounded-lg border border-border">
        <h1 className="text-2xl font-bold mb-4">Friends</h1>
        <div className="gap-4">
          <div className="grid gap-4 mb-6">
            <ActionCard icon={<FaLink />} label="Add Friend By Id" onClick={handleFindById}/>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-accent rounded hover:bg-ring border border-ring flex items-center px-3 py-2 w-full">
              <FaSearch className="text-accent-foreground mr-2" />
              <input
                type="text"
                placeholder="Enter Username"
                className="bg-transparent outline-none text-accent-foreground placeholder-accent-foreground w-full"
              />
            </div>

            <div className="rounded">
              {/*<div className="flex justify-between items-center mb-4">*/}
              {/*  <span className="text-lg font-semibold">Friends</span>*/}
              {/*</div>*/}

              {/*<div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">*/}
              {/*  {friendsData.map((friend) => (*/}
              {/*    <UserRow*/}
              {/*      key={friend.id}*/}
              {/*      avatarUrl={friend.image}*/}
              {/*      username={`${friend.firstName.toLowerCase()}_${friend.lastName.toLowerCase()}`}*/}
              {/*      displayName={`${friend.firstName} ${friend.lastName}`}*/}
              {/*      onPlayClick={() =>*/}
              {/*        console.log(`Play with ${friend.firstName}`)*/}
              {/*      }*/}
              {/*      onMessageClick={() =>*/}
              {/*        console.log(`Message ${friend.firstName}`)*/}
              {/*      }*/}
              {/*      onAddFriendClick={() =>*/}
              {/*        console.log(`Add ${friend.firstName}`)*/}
              {/*      }*/}
              {/*      onProfileClick={() =>*/}
              {/*        console.log(`View ${friend.firstName}'s profile`)*/}
              {/*      }*/}
              {/*      onGiftClick={() =>*/}
              {/*        console.log(`Send gift to ${friend.firstName}`)*/}
              {/*      }*/}
              {/*    />*/}
              {/*  ))}*/}
              {/*</div>*/}
              <TabsFriend></TabsFriend>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;
