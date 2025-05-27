import React from "react";

type AddFriendRowProps = {
  avatarUrl: string;
  username: string;
  displayName: string;
  onAcceptClick?: () => void;
  onDeclineClick?: () => void;
};

const AddFriendRow: React.FC<AddFriendRowProps> = ({
  avatarUrl,
  username,
  displayName,
  onAcceptClick,
  onDeclineClick,
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

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={onAcceptClick}
          className="bg-accent hover:bg-ring text-accent-foreground px-3 py-1 rounded border border-border"
        >
          Đồng ý
        </button>
        <button
          onClick={onDeclineClick}
          className="bg-destructive hover:bg-ring text-accent-foreground px-3 py-1 rounded"
        >
          Từ chối
        </button>
      </div>
    </div>
  );
};

export default AddFriendRow;
