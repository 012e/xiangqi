import React, { useState } from 'react';
import ModernButton from '@/components/ui/modern-button';

const AddFriendForm: React.FC = () => {
  const [friendName, setFriendName] = useState('');

  const handleAddFriend = () => {
    alert(`Friend "${friendName}" added!`);
    setFriendName('');
  };

  return (
    <div className="flex justify-between mb-4 bg-card text-card-foreground">
      <input
        type="text"
        placeholder="Nhập tên bạn bè"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
        className="flex-1 p-2 mr-4 border border-gray-300 rounded-lg"
      />
      <ModernButton variant="ghost" onClick={handleAddFriend}>
        Thêm bạn bè
      </ModernButton>
    </div>
  );
};

export default AddFriendForm;