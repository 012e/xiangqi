import { useQuery } from '@tanstack/react-query';
import { getRequestSent } from '@/lib/friend/friend-request-list.ts';
import { CircleX } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar.tsx';

type SentTabProps = {
  searchText: string;
};

export default function SentTab({ searchText }: SentTabProps) {
  const { data: friendSent } = useQuery({
    queryKey: ['listSent'],
    queryFn: getRequestSent,
  });

  const handleCancel = (userId: number) => {
    // TODO: Implement cancel friend request functionality when API is available
    console.log('Cancel friend request for user:', userId);
  };

  const filteredList = friendSent?.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div>
      {filteredList?.map((sentRequest, index) => (
        <div 
          key={index}
          className="flex justify-between items-center p-3 w-full rounded hover:cursor-pointer bg-accent hover:opacity-85"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={sentRequest.picture} alt="Avatar" />
              <AvatarFallback>???</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold leading-none text-foreground">
                {sentRequest.username}
              </p>
              <p className="text-sm leading-none text-foreground">{sentRequest.name}</p>
            </div>
          </div>
          
          <div>
            <CircleX
              className="w-5 h-auto cursor-pointer hover:opacity-70"
              onClick={() => handleCancel(sentRequest.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
