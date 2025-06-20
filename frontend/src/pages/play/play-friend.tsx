import { Search, Send, SquareUser, UserPlus } from 'lucide-react';
import SelfPlayBoard from './self-playboard';
import { useState } from 'react';
import { FaUserFriends } from "react-icons/fa";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'cmdk';
import { Command } from '@/components/ui/command';
import { useQuery } from '@tanstack/react-query';

import { getFriendList } from '@/lib/friend/friend-request-list.ts';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import MovePosition, { HistoryMove } from '@/components/move-position';
export default function PlayFriend() {
  const [player, setPlayer] = useState<'white' | 'black'>('white');
  const [selectHistory, setSelectHistory] = useState<HistoryMove>();
  const [history, setHistory] = useState<string[]>([]);
  const [isViewingHistory, setIsViewingHistory] = useState(false);


  const {data: listFriend} = useQuery(
    {
      queryKey: ['listFriends'],
      queryFn: getFriendList
    }
  )
  const navigate = useNavigate();
  function updateHistory(history: string[]) {
    setHistory([...history]);
  }
  function getRestoreGame(state: HistoryMove) {
    setSelectHistory(state);
    setIsViewingHistory(true);
  }

  function handleReturnToCurrentGame() {
    setSelectHistory(undefined);
    setIsViewingHistory(false);
  }
  return (
    <div className="w-full h-full text-foreground flex justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-[550px_400px] bg-background">
        {/* Left */}
        <div className="p-4 lg:block hidden mt-5">
          <div className="flex flex-wrap space-x-2 justify-center">
            <span>
              <SquareUser size={30} />
            </span>
            <span>opponent</span>
          </div>
          <div className="flex justify-center p-3 items-center">
            <div className="border-2">
              <SelfPlayBoard
                              boardOrientation={player}
                              onMove={({ newBoard }) => {
                                updateHistory(newBoard.getHistory());
                              }}
                              currentHistory={history}
                              restoreGameState={selectHistory}
                              isViewingHistory={isViewingHistory}
                              onReturnToCurrentGame={handleReturnToCurrentGame}
                            />
            </div> 
          </div>
          <div className="flex flex-wrap space-x-2 justify-center ">
            <span>
              <SquareUser size={30} />
            </span>
            <span>Me</span>
          </div>
        </div>
        {/* Right */}
        <div className="h-auto rounded-4xl my-5 bg-secondary shadow-lg shadow-ring">
          <div className="flex flex-col items-center p-6 space-y-6 ">
            <div className="flex space-x-3">
              <div className='flex items-center justify-center gap-1'>
                  <span>
                    <FaUserFriends className='text-4xl'/>
                  </span>
                <h1 className=" text-4xl font-bold justify-center tracking-tight">
                  Play a Friend
                </h1>
              </div>
            </div>
            <div className="bg-background rounded-2xl w-full">
                <MovePosition
                  moves={history}
                  setRestoreHistory={getRestoreGame}
                  isViewingHistory={isViewingHistory}
                  onReturnToCurrentGame={handleReturnToCurrentGame}
                />
              </div>
            <div className="w-full shadow-2xl">
              <Command className="border shadow h-70">
                <div className="flex group p-2 space-x-2">
                  <span>
                    <Search className="pt-0.5 w-5 h-auto"></Search>
                  </span>
                  <CommandInput
                    placeholder="Type a command or search..."
                    className="focus:border-none w-full focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent"
                  />
                </div>
                <CommandList className="">
                  <CommandEmpty className="p-3 flex items-center justify-center">No results found.</CommandEmpty>
                  <CommandGroup
                    className="font-bold overflow-auto h-50"
                  >
                      {listFriend?.map((fr, index) => {
                        return (
                          <CommandItem
                            className="flex gap-3 justify-start items-center !text-2 !pl-2 font-normal hover:bg-muted  p-3"
                            key={index}
                          >
                            <Avatar>
                              <AvatarImage src={fr.picture} ></AvatarImage>
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            {fr.username}
                            <span className="ml-auto ">
                              <Send className="hover:cursor-pointer hover:opacity-70 font-semibold" ></Send>
                            </span>
                          </CommandItem>
                        );
                      })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            <div className="w-full">
              <Button className="w-full flex items-center justify-center px-4 py-3 rounded-md transition"
              onClick={() => navigate('/social/friend')}>
                <span className="flex items-center space-x-3">
                  <UserPlus size={18} />
                  <span className="font-semibold">Add friends</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
