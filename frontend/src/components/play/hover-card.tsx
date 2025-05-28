import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card.tsx';
import {
  Binoculars, ChartLine,
  CircleX,
  Ellipsis,
  Glasses,
  Handshake, History,
  Mail,
  MessageSquareWarning,
  Sword,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';

export type HoverCardType = {
  name: string;
  image: string;
  score: number;
}

export function HoverCardOpponent({ props }: { props: HoverCardType }) {
  return (
    <div className="w-full">
      <HoverCard>
        <div className="flex items-center">
          <HoverCardTrigger>
            <div className="w-13 h-13 flex items-center">
              <img className="flex self-center rounded-xs" src={props.image} alt="Avatar" />
            </div>
          </HoverCardTrigger>
          <HoverCardTrigger>
            <div className="flex flex-col p-2">
              <div className="font-semibold text-md tracking-tight">
                {props.name}
              </div>
              <div className="text-md text-muted-foreground flex items-center tracking-tight">
                ( <Zap className="size-3"></Zap>{props.score ?? 0})
              </div>
            </div>
          </HoverCardTrigger>
        </div>
        <HoverCardContent className="w-auto">
          <div className="flex flex-col gap-2 p-3">
            <div className="flex">
              <img src={props.image} className="rounded-md size-25 flex items-center" alt="Avatar" />
              <div className="flex flex-col p-3 gap-2">
                <div className="font-semibold text-muted-foreground text-md tracking-tight">
                  {props.name}
                </div>
                <div className="text-md text-muted-foreground flex gap-1 tracking-tight">
                  <Zap className="size-5"></Zap>
                  {props.score ?? 0}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Popover>
                <PopoverTrigger>
                  <Button className="px-7 py-2 ">
                    <Ellipsis></Ellipsis>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <div className="flex flex-col gap-4 w-auto">
                    <div className="w-auto flex font-semibold hover:cursor-pointer hover:text-muted-foreground items-center gap-2">
                      <Sword></Sword>
                      <div className="tracking-tight">Challenge</div>
                    </div>
                    <div className="w-auto flex font-semibold hover:cursor-pointer hover:text-muted-foreground items-center gap-2">
                      <Mail></Mail>
                      <div className="tracking-tight">Message</div>
                    </div>
                    <div className="w-auto flex font-semibold hover:cursor-pointer hover:text-muted-foreground items-center gap-2">
                      <CircleX></CircleX>
                      <div className="tracking-tight">Block</div>
                    </div>
                    <div className="w-auto flex font-semibold hover:cursor-pointer hover:text-muted-foreground items-center gap-2">
                      <MessageSquareWarning></MessageSquareWarning>
                      <div className="tracking-tight">Report</div>
                    </div>
                    <div className="w-auto flex font-semibold hover:cursor-pointer hover:text-muted-foreground items-center gap-2">
                      <Glasses></Glasses>
                      <div className="tracking-tight">Spectate</div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="grid grid-cols-2 gap-2">
                <Button className=" tracking-tight w-auto flex font-semibold hover:text-muted-foreground items-center gap-2">
                  <Handshake></Handshake>
                  <div>Add Friend</div>
                </Button>
                <Button className="tracking-tight w-auto flex font-semibold hover:text-muted-foreground items-center gap-2">
                  <Binoculars></Binoculars>
                  <div>Watch</div>
                </Button>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
export function HoverCardMe({ props }: { props: HoverCardType }) {
  return (
    <div className="w-full">
      <HoverCard>
        <div className="flex items-center">
          <HoverCardTrigger>
            <div className="w-13 h-13 flex items-center">
              <img className="size-full rounded-xs flex items-center" src={props.image} alt="Avatar" />
            </div>
          </HoverCardTrigger>
          <HoverCardTrigger>
            <div className="flex flex-col p-2">
              <div className="font-semibold text-md tracking-tight">
                {props.name}
              </div>
              <div className="text-md text-muted-foreground flex items-center tracking-tight">
                ( <Zap className="size-3"></Zap>{props.score ?? 0})
              </div>
            </div>
          </HoverCardTrigger>
        </div>
        <HoverCardContent className="w-auto">
          <div className="flex flex-col gap-2 p-3">
            <div className="flex">
              <img src={props.image} className="rounded-md size-25 flex items-center" alt="Avatar" />
              <div className="flex flex-col p-3 gap-2">
                <div className="font-semibold text-md text-muted-foreground tracking-tight">
                  {props.name}
                </div>
                <div className="text-md text-muted-foreground flex gap-1 tracking-tight">
                  <Zap className="size-5"></Zap>
                  {props.score ?? 0}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button className="w-auto flex font-semibold hover:text-muted-foreground items-center gap-2">
                <ChartLine></ChartLine>
                <div className="tracking-tight">Star</div>
              </Button>
              <Button className="w-auto flex font-semibold hover:text-muted-foreground items-center gap-2">
                <History></History>
                <div className="tracking-tight">Game History</div>
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
export default HoverCardOpponent;