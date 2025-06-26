import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card.tsx';
import {
  Binoculars,
  ChartLine,
  CircleX,
  Ellipsis,
  Glasses,
  Handshake,
  History,
  Mail,
  MessageSquareWarning,
  Sword,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Player } from '@/stores/online-game-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export type PlayerCardProps = {
  player: Player;
  onAddFriend?: (id: number) => Promise<unknown>;
  isCurrentPlayer?: boolean;
  isBot?: boolean;
};

// Format time from milliseconds to mm:ss:xx
function formatTime(ms: number): string {
  // return ms.toString();
  // example: 137608 (s)
  const totalSeconds = Math.round(ms / 1000); // 138
  const minutes = Math.floor(totalSeconds / 60); // 2
  const seconds = totalSeconds % 60; // 18
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

function EloChangeText({ eloChange }: { eloChange?: number }) {
  if (eloChange === undefined) {
    return null;
  }

  const eloChangeClass = eloChange > 0 ? 'text-green-500' : 'text-red-500';
  return (
    <span className={`text-sm ${eloChangeClass}`}>
      {eloChange > 0 ? `+${eloChange}` : eloChange}
    </span>
  );
}

export function PlayerCard({
  player,
  onAddFriend,
  isCurrentPlayer = false,
}: PlayerCardProps) {
  const displayedElo = useMemo(() => {
    if (player.eloChange) {
      return player.elo + player.eloChange;
    }
    return player.elo;
  }, [player.elo, player.eloChange]);

  const { mutate: mutateAddFriend } = useMutation({
    mutationFn: async (id: number) => {
      if (!onAddFriend) {
        throw new Error('onAddFriend function is not provided');
      }
      await onAddFriend(id);
    },
    onSuccess: () => {
      console.log('Friend request sent successfully');
    },
    onError: (error: any) => {
      console.error('Error sending friend request:', error);
    },
  });

  async function handleAddFriend() {
    if (!player || !player.id) {
      throw new Error('Player data is incomplete');
    }

    if (isCurrentPlayer) {
      throw new Error('Cannot add yourself as a friend');
    }

    if (onAddFriend) {
      mutateAddFriend(player.id);
    } else {
      console.warn('onAddFriend function is not provided');
    }
  }

  return (
    <div className="w-full">
      <HoverCard>
        <div className="flex items-center justify-between w-[450px]">
          <div className="flex">
            <HoverCardTrigger asChild>
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={player.picture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </HoverCardTrigger>
            <HoverCardTrigger asChild>
              <div className="flex flex-col p-2">
                <div className="items-center font-semibold tracking-tight text-md">
                  {player.username}
                </div>
                <span className="flex items-center tracking-tight text-md text-muted-foreground">
                  <Zap className="size-3"></Zap>
                  <div className="flex gap-1 items-center">
                    <span>{displayedElo ?? 0}</span>
                    <EloChangeText eloChange={player.eloChange} />
                  </div>
                </span>
              </div>
            </HoverCardTrigger>
          </div>
          <div className="text-xl font-bold">{formatTime(player?.time)}</div>
        </div>
        <HoverCardContent className="w-auto" asChild>
          <div className="flex flex-col gap-2 p-3">
            <div className="flex">
              <img
                src={player.picture}
                className="flex justify-center items-center rounded-md size-25"
                alt="Avatar"
              />
              <div className="flex flex-col gap-2 p-3">
                <div className="font-semibold tracking-tight text-muted-foreground text-md">
                  {player.username}
                </div>
                <span className="flex items-center tracking-tight text-md text-muted-foreground">
                  <Zap className="size-3"></Zap>
                  {/* TODO: consider using displayedElo directly} */}
                  <span>{player.elo ?? 0}</span>
                </span>
              </div>
            </div>
            {isCurrentPlayer ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button className="flex gap-2 items-center w-auto font-semibold hover:text-muted-foreground">
                  <ChartLine></ChartLine>
                  <div className="tracking-tight">Star</div>
                </Button>
                <Button className="flex gap-2 items-center w-auto font-semibold hover:text-muted-foreground">
                  <History></History>
                  <div className="tracking-tight">Game History</div>
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="py-2 px-7">
                      <Ellipsis></Ellipsis>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <div className="flex flex-col gap-4 w-auto">
                      <div className="flex gap-2 items-center w-auto font-semibold hover:cursor-pointer hover:text-muted-foreground">
                        <Sword></Sword>
                        <div className="tracking-tight">Challenge</div>
                      </div>
                      <div className="flex gap-2 items-center w-auto font-semibold hover:cursor-pointer hover:text-muted-foreground">
                        <Mail></Mail>
                        <div className="tracking-tight">Message</div>
                      </div>
                      <div className="flex gap-2 items-center w-auto font-semibold hover:cursor-pointer hover:text-muted-foreground">
                        <CircleX></CircleX>
                        <div className="tracking-tight">Block</div>
                      </div>
                      <div className="flex gap-2 items-center w-auto font-semibold hover:cursor-pointer hover:text-muted-foreground">
                        <MessageSquareWarning></MessageSquareWarning>
                        <div className="tracking-tight">Report</div>
                      </div>
                      <div className="flex gap-2 items-center w-auto font-semibold hover:cursor-pointer hover:text-muted-foreground">
                        <Glasses></Glasses>
                        <div className="tracking-tight">Spectate</div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleAddFriend}
                    className="flex gap-2 items-center w-auto font-semibold tracking-tight hover:text-muted-foreground"
                  >
                    <Handshake></Handshake>
                    <div>Add Friend</div>
                  </Button>
                  <Button className="flex gap-2 items-center w-auto font-semibold tracking-tight hover:text-muted-foreground">
                    <Binoculars></Binoculars>
                    <div>Watch</div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
export default PlayerCard;
