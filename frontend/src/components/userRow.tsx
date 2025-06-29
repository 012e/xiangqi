import React, { useState } from 'react';
import { FaGamepad } from 'react-icons/fa';
import { Check, CircleX, Trash2, UserPlus, X } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';
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
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
  const handlePlay = () => {
    if (onPlayClick) {
      onPlayClick.mutate(userId, {});
    }
  };
  const handleRemove = () => {
    if (onRemove) {
      onRemove.mutate(userId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['listFriends'] });
        },
      });
    }
  };
  const handleCancel = () => {
    if (onCancel) {
      onCancel.mutate(userId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['listSent'] });
        },
      });
    }
  };
  const handleAccept = () => {
    if (onAccept) {
      onAccept.mutate(userId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['listPending'] });
          queryClient.invalidateQueries({ queryKey: ['listFriends'] });
        },
      });
    }
  };
  const handleDecline = () => {
    if (onDecline) {
      onDecline.mutate(userId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['listPending'] });
        },
      });
    }
  };
  const handleAddFriend = () => {
    if (onAddFriendClick) {
      onAddFriendClick.mutate(userId, {
        onSuccess: () => {
          setIsFriendRequestSent(true);
          queryClient.invalidateQueries({ queryKey: ['listSuggestions'] });
          queryClient.invalidateQueries({ queryKey: ['listSent'] });
        },
      });
    }
  };
  return (
    <div className="flex justify-between items-center p-3 w-full rounded hover:cursor-pointer bg-accent hover:opacity-85">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt="Avatar" />
          <AvatarFallback>???</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold leading-none text-foreground">
            {username}
          </p>
          <p className="text-sm leading-none text-foreground">{displayName}</p>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex space-x-4 text-sm text-foreground">
        {typeTab === 'friend' ? (
          <div className="flex gap-2 justify-center items-center">
            <FaGamepad
              className="w-5 h-auto cursor-pointer hover:opacity-70"
              onClick={handlePlay}
            />
            <Trash2
              className="w-5 h-auto cursor-pointer hover:opacity-70"
              onClick={handleRemove}
            />
          </div>
        ) : typeTab === 'sent' ? (
          <div>
            <CircleX
              className="w-5 h-auto cursor-pointer hover:opacity-70"
              onClick={handleCancel}
            />
          </div>
        ) : typeTab === 'pending' ? (
          <div className="flex gap-2">
            <Check
              className="w-5 h-auto cursor-pointer hover:opacity-70"
              onClick={handleAccept}
            />
            <X
              className="w-5 h-auto cursor-pointer hover:opacity-70"
              onClick={handleDecline}
            />
          </div>
        ) : typeTab === 'suggestions' ? (
          <div>
            {isFriendRequestSent ? (
              <CircleX className="w-5 h-auto cursor-pointer hover:opacity-70 text-muted-foreground" />
            ) : (
              <UserPlus
                className="w-5 h-auto cursor-pointer hover:opacity-70"
                onClick={handleAddFriend}
              />
            )}
          </div>
        ) : (
          'Not found'
        )}
      </div>
    </div>
  );
};

export default UserRow;
