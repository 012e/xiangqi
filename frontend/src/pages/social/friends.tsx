import React, { useState } from 'react';
import ActionCard from '@/components/actionCard';
import { FaLink, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import TabsFriend from '@/components/customized/tabs/tabs-friend.tsx';
import { Input } from '@/components/ui/input.tsx';


const Friends: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

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
            <div className="rounded flex items-center px-3 py-2 w-full">
              <FaSearch className="text-accent-foreground mr-2" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Enter Username"
                className="bg-transparent outline-none text-accent-foreground placeholder-accent-foreground w-full"
              />
            </div>

            <div className="rounded">
              <TabsFriend searchText={searchTerm}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;
