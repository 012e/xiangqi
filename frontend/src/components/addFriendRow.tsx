import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Player } from '@/lib/online/game-response.ts';


type AddFriendRowProps = {
  avatarUrl: string;
  username: string;
  email: string;
  onAcceptClick?: () => void;
  onDeclineClick?: () => void;
  isFriend?: boolean;
  listFriend?: Player[];
};

const AddFriendRow: React.FC<AddFriendRowProps> = ({
  avatarUrl,
  username,
  email,
  onAcceptClick,
  listFriend,
}) => {

  
  function checkIfFriend() {
    if(listFriend) {
      return !!listFriend.find(friend => friend.username === username)
    }
    return false;
  }
  return (
    <div className="bg-accent rounded flex items-center justify-between p-3 w-full">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={'avatar'}></AvatarImage>
          <AvatarFallback >CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5">
          <p className="text-foreground font-semibold leading-none">{username}</p>
          <p className="text-sm text-foreground leading-none">{email}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {
          checkIfFriend() ? (<div>
            <p className="font-bold p-3 text-chart-2">Friend</p>
          </div>) : (
            <Button
            onClick={onAcceptClick}
            className="bg-destructive hover:bg-ring text-accent-foreground px-3 py-1 rounded border border-border"
          >
            Add Friend
          </Button>)
        }

      </div>
    </div>
  );
};

export default AddFriendRow;
