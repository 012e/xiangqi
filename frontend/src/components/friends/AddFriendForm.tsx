import React, { useState } from 'react';
import ModernButton from '@/components/ui/modern-button';
import { createFriendsStyles } from '@/styles';
import { useTheme } from '@/themes/ThemeContext';

const AddFriendForm: React.FC = () => {
  const [friendName, setFriendName] = useState('');
  const { theme } = useTheme();
  const friendsStyles = createFriendsStyles(theme);

  const handleAddFriend = () => {
    alert(`Friend "${friendName}" added!`);
    setFriendName('');
  };

  return (
    <div style={friendsStyles.addFriendFormContainer}>
      <input
        type="text"
        placeholder="Nhập tên bạn bè"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
        style={{
          ...friendsStyles.addFriendInput,
          backgroundColor: theme.colors.item,
          borderColor: theme.colors.text,
        }}
      />
      <ModernButton variant="ghost" onClick={handleAddFriend}>
        Thêm bạn bè
      </ModernButton>
    </div>
  );
};

export default AddFriendForm;