import React from 'react';
import {
  FaGamepad,
  FaEnvelope,
  FaUserPlus,
  FaUser,
  FaGift,
} from 'react-icons/fa';
import { Check, CircleX, Trash2, UserPlus, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';

type UserRowProps = {
  avatarUrl: string;
  username: string;
  displayName: string;
  //friend
  onPlayClick?: () => void;
  onRemove?: () => void;

  //sent
  onCancel?: () => void;

  //pending
  onAccept?: () => void;
  onDecline?: () => void;

  //suggestions
  onAddFriendClick?: () => void;

  typeTab: string;
};

const UserRow: React.FC<UserRowProps> = ({
                                           avatarUrl,
                                           username,
                                           displayName,
                                           onPlayClick,
                                           onRemove,
                                           onCancel,
                                           onAccept,
                                           onDecline,
                                           onAddFriendClick,
                                           typeTab,
                                         }) => {
  return (
    <div className="bg-accent rounded hover:cursor-pointer hover:opacity-85 flex items-center justify-between p-3 w-full">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt="Avatar" />
          <AvatarFallback>???</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-foreground font-semibold leading-none">{username}</p>
          <p className="text-sm text-foreground leading-none">{displayName}</p>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex space-x-4 text-foreground text-sm">
        {
          typeTab === 'friend' ? <div className="flex gap-2">
              <FaGamepad className="hover:opacity-70 cursor-pointer" onClick={onPlayClick} />
              <Trash2 className="hover:opacity-70 cursor-pointer" onClick={onRemove} />
            </div> :
            typeTab === 'sent' ? <div>
              <CircleX className="hover:opacity-70 cursor-pointer" onClick={onCancel} />
              </div> :
              typeTab === 'pending' ? <div className="flex gap-2">
                <Check className="hover:opacity-70 cursor-pointer" onClick={onAccept} />
                <X className="hover:opacity-70 cursor-pointer" onClick={onDecline} />
                </div> :
                typeTab === 'suggestions' ? <div>
                  <UserPlus className="hover:opacity-70 cursor-pointer" onClick={onAddFriendClick} />
                </div> : "Not found"
        }
      </div>
    </div>
  );
};

export default UserRow;
