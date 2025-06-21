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
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useMatch } from 'react-router';
import { useMemo } from 'react';

export type HoverCardType = {
  name: string;
  image: string;
  elo: number;
  eloChange?: number;
  isMe: boolean;
  userId?: number;
  btnAddFriend?: UseMutationResult<AxiosResponse, Error, number>;
};

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

export function PlayerCard({ props }: { props: HoverCardType }) {
  const handleAddFriend = () => {
    if (props.btnAddFriend && props.userId) {
      props.btnAddFriend.mutate(props.userId);
    }
  };
  const displayedElo = useMemo(() => {
    if (props.eloChange) {
      return props.elo + props.eloChange;
    }
    return props.elo;
  }, [props.elo, props.eloChange]);

  return (
    <div className="w-full">
      <HoverCard>
        <div className="flex items-center">
          <HoverCardTrigger>
            <div className="flex items-center w-13 h-13">
              <img
                className="flex self-center rounded-xs"
                src={props.image}
                alt="Avatar"
              />
            </div>
          </HoverCardTrigger>
          <HoverCardTrigger>
            <div className="flex flex-col p-2">
              <div className="items-center font-semibold tracking-tight text-md">
                {props.name}
              </div>
              <span className="flex items-center tracking-tight text-md text-muted-foreground">
                <Zap className="size-3"></Zap>
                <div className="flex gap-1 items-center">
                  <span>{displayedElo ?? 0}</span>
                  <EloChangeText eloChange={props.eloChange} />
                </div>
              </span>
            </div>
          </HoverCardTrigger>
        </div>
        <HoverCardContent className="w-auto" asChild>
          <div className="flex flex-col gap-2 p-3">
            <div className="flex">
              <img
                src={props.image}
                className="flex justify-center items-center rounded-md size-25"
                alt="Avatar"
              />
              <div className="flex flex-col gap-2 p-3">
                <div className="font-semibold tracking-tight text-muted-foreground text-md">
                  {props.name}
                </div>
                <span className="flex items-center tracking-tight text-md text-muted-foreground">
                  <Zap className="size-3"></Zap>
                  {/* TODO: consider using displayedElo directly} */}
                  <span>{props.elo ?? 0}</span>
                </span>
              </div>
            </div>
            {props.isMe ? (
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
                  <PopoverTrigger>
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
