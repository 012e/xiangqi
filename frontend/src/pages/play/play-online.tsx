import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Flag,
  Handshake,
  Loader2,
  Play,
} from 'lucide-react';
import SelfPlayBoard from './self-playboard';
import Combobox from '@/components/combobox';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import MovePosition from '@/components/move-position';
import { useCreateGame } from '@/stores/useCreateGame.ts';
import { useQuery } from '@tanstack/react-query';
import { GameType, getGameTypes } from '@/lib/online/game-type.ts';

export default function PlayOnline() {
  const { createGame, loading } = useCreateGame();
  const [opponent] = React.useState('Opponent');
  const [player, setPlayer] = useState<'white' | 'black'>('white');
  const { data: gameTypes } = useQuery({
    queryKey: ['gameTypes'],
    queryFn: getGameTypes,
  });
  const [selectedGameType, setSelectedGameType] = useState<
    GameType | undefined
  >();

  function togglePlayer() {
    setPlayer((prev) => (prev === 'white' ? 'black' : 'white'));
  }

  function handleCreateGame() {
    if (selectedGameType) {
      return createGame(selectedGameType.id);
    }
  }
  return (
    <div className="w-full text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-[550px_400px]">
        {/* Left */}
        <div className="min-h-screen p-4 lg:block hidden mt-10 bg-background">
          <div className="flex flex-wrap space-x-2 justify-center">
            <span>
              <CircleUser size={30} />
            </span>
            <span>{opponent}</span>
          </div>
          <div className="flex justify-center p-3">
            <div className="border-2">
              <SelfPlayBoard boardOrientation={player} />
            </div>
          </div>
          <div className="flex flex-wrap space-x-2 justify-center ">
            <span>
              <CircleUser size={30} />
            </span>
            <span>Me</span>
          </div>
        </div>
        {/* Right */}
        <div className="rounded-4xl my-5 h-165 bg-muted shadow-lg shadow-ring">
          <div className="min-h-screen flex flex-col items-center p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-bold justify-center tracking-tight">
                Play Online
              </h1>
            </div>
            <div className="flex items-center hover:cursor-pointer">
              <Combobox
                gameType={gameTypes}
                onSelect={(item) => setSelectedGameType(item)}
              />
            </div>
            <div >
              <Button
                className="hovegr:text-4xl text-3xl h-13 font-bold w-2xs"
                onClick={handleCreateGame}
              >
              <div>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="!w-7 !h-auto mr-1 animate-spin"></Loader2>
                    START
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Play className="!w-7 !h-auto mr-1"></Play>
                    START
                  </div>
                )}
              </div>
              </Button>
            </div>

            <div className="bg-background rounded-2xl w-full">
              <MovePosition/>
            </div>
            <div className="flex space-x-3">
              <Button className="group">
                <Handshake className="transition-transform group-hover:scale-150 text-green-500" />
              </Button>
              <Button className="group">
                <Flag className="transition-transform group-hover:scale-150 "></Flag>
              </Button>
              <Button className="group">
                <ChevronLeft className="transition-transform group-hover:scale-150 text-gray-400" />
              </Button>
              <Button className="group">
                <ChevronRight className="transition-transform group-hover:scale-150 text-gray-400" />
              </Button>
              <Button className="group" onClick={togglePlayer}>
                <ArrowUpDown className="transition-transform group-hover:scale-150 text-blue-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
