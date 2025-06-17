import React from "react";
import {
  FaGamepad,
  FaEnvelope,
  FaUserPlus,
  FaUser,
  FaGift,
} from "react-icons/fa";

type UserRowProps = {
  avatarUrl: string;
  username: string;
  displayName: string;
  onPlayClick?: () => void;
  onMessageClick?: () => void;
  onAddFriendClick?: () => void;
  onProfileClick?: () => void;
  onGiftClick?: () => void;
};

const UserRow: React.FC<UserRowProps> = ({
  avatarUrl,
  username,
  displayName,
  onPlayClick,
  onMessageClick,
  onAddFriendClick,
  onProfileClick,
  onGiftClick,
}) => {
  return (
    <div className="bg-accent rounded hover:bg-ring text-white flex items-center justify-between p-3 w-full">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-3">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-12 h-12 rounded object-cover"
        />
        <div>
          <p className="text-foreground font-semibold leading-none">{username}</p>
          <p className="text-sm text-foreground leading-none">{displayName}</p>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex space-x-4 text-foreground text-sm">
        <FaGamepad className="hover:text-accent cursor-pointer" onClick={onPlayClick} />
        <FaEnvelope className="hover:text-accent cursor-pointer" onClick={onMessageClick} />
        <FaUserPlus className="hover:text-accent cursor-pointer" onClick={onAddFriendClick} />
        <FaUser className="hover:text-accent cursor-pointer" onClick={onProfileClick} />
        <FaGift className="hover:text-accent cursor-pointer" onClick={onGiftClick} />
      </div>
    </div>
  );
};

export default UserRow;
