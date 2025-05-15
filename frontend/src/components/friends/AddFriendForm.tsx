import React, { useState } from 'react';
import ModernButton from '@/components/ui/modern-button';
import { Input } from '@/components/ui/input.tsx';

const AddFriendForm: React.FC = () => {
  const [friendName, setFriendName] = useState('');

  const handleAddFriend = () => {
    alert(`Friend "${friendName}" added!`);
    setFriendName('');
  };

  return (
    <div className="flex justify-between mb-4 bg-card text-card-foreground">
      <Input
        placeholder="Nhập tên bạn bè"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
        className="mr-4"
      />
      <ModernButton variant="ghost" onClick={handleAddFriend}>
        Thêm bạn bè
      </ModernButton>
    </div>
  );
};

export default AddFriendForm;