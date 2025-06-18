import React from 'react';
import {
  FaGamepad,
} from 'react-icons/fa';
import { Check, CircleX, Trash2, UserPlus, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

type UserRowProps = {
  userId: number;
  avatarUrl: string;
  username: string;
  displayName: string;
  //friend
  onPlayClick?: UseMutationResult<AxiosResponse, Error, number>;
  onRemove?: UseMutationResult<AxiosResponse, Error, number>;

  //sent
  onCancel?: UseMutationResult<AxiosResponse, Error, number>;

  //pending
  onAccept?: UseMutationResult<AxiosResponse, Error, number>;
  onDecline?: UseMutationResult<AxiosResponse, Error, number>;

  //suggestions
  onAddFriendClick?: UseMutationResult<AxiosResponse, Error, number>;

  typeTab: string;
};

const UserRow: React.FC<UserRowProps> = ({
                                           userId,
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
  const queryClient = useQueryClient();
  const handlePlay = () => {
    if(onPlayClick) {
      onPlayClick.mutate(userId,{})
    }
  }
  const handleRemove = () => {
    if(onRemove) {
      onRemove.mutate(userId,{
        onSuccess:  () => {
          queryClient.invalidateQueries({ queryKey: ['listFriends'] })
        }
      });
    }
  }
  const handleCancel = () => {
    if(onCancel) {
      onCancel.mutate(userId,{
        onSuccess:  () => {
          queryClient.invalidateQueries({ queryKey: ['listSent'] })
        }
      });
    }
  }
  const handleAccept = () => {
    if (onAccept) {
      onAccept.mutate(userId, {
        onSuccess:  () => {
          queryClient.invalidateQueries({ queryKey: ['listPending'] })
          queryClient.invalidateQueries({ queryKey: ['listFriends'] })
        }
      })
    }
  }
  const handleDecline = () => {
    if (onDecline) {
      onDecline.mutate(userId, {
        onSuccess:  () => {
          queryClient.invalidateQueries({ queryKey: ['listPending'] })
        }
      })
    }
  }
  const handleAddFriend = () => {
    if (onAddFriendClick) {
      onAddFriendClick.mutate(userId, {
        onSuccess:  () => {
          queryClient.invalidateQueries({ queryKey: ['listSuggestions'] })
        }
      })
    }
  }
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
              <FaGamepad className="hover:opacity-70 cursor-pointer" onClick={handlePlay} />
              <Trash2 className="hover:opacity-70 cursor-pointer" onClick={handleRemove} />
            </div> :
            typeTab === 'sent' ? <div>
              <CircleX className="hover:opacity-70 cursor-pointer" onClick={handleCancel} />
              </div> :
              typeTab === 'pending' ? <div className="flex gap-2">
                <Check className="hover:opacity-70 cursor-pointer" onClick={handleAccept} />
                <X className="hover:opacity-70 cursor-pointer" onClick={handleDecline} />
                </div> :
                typeTab === 'suggestions' ? <div>
                  <UserPlus className="hover:opacity-70 cursor-pointer" onClick={handleAddFriend} />
                </div> : "Not found"
        }
      </div>
    </div>
  );
};

export default UserRow;
