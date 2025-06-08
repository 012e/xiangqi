import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Flag,
  Handshake,
  Loader2,
  Play,
  SquareUser,
} from 'lucide-react';
import SelfPlayBoard from './self-playboard';
import Combobox from '@/components/combobox';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import MovePosition, { HistoryMove } from '@/components/move-position';
import { useCreateGame } from '@/stores/useCreateGame.ts';
import { useQuery } from '@tanstack/react-query';
import { GameType, getGameTypes } from '@/lib/online/game-type.ts';
import { Slider } from '@/components/ui/slider.tsx';
import { RiBaseStationLine } from "react-icons/ri";
import { FaRobot } from "react-icons/fa";
export default function PlayOnline({ isOnline }: { isOnline: boolean }) {
  const { createGame, loading } = useCreateGame();
  const [selectHistory, setSelectHistory] = useState<HistoryMove>();
  const [history, setHistory] = useState<string[]>([]);
  const [opponent] = React.useState('Opponent');
  const [player, setPlayer] = useState<'white' | 'black'>('white');
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const { data: gameTypes } = useQuery({
    queryKey: ['gameTypes'],
    queryFn: getGameTypes,
  });
  const [selectedGameType, setSelectedGameType] = useState<
    GameType | undefined
  >();
  const [strength, setStrength] = useState<number>(0);

  function togglePlayer() {
    setPlayer((prev) => (prev === 'white' ? 'black' : 'white'));
  }

  function updateHistory(history: string[]) {
    setHistory([...history]);
  }

  function handleCreateGame() {
    if (selectedGameType) {
      if (isOnline) {
        return createGame({ gameTypeId: selectedGameType.id });
      } else {
        return createGame({
          gameTypeId: selectedGameType.id,
          playWithComputer: true,
          strength,
        });
      }
    }
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
    <div className="w-full h-auto text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-[550px_400px]">
        {/* Left */}
        <div className="hidden p-4 mt-25 h-auto lg:block bg-background">
          <div className="flex flex-wrap justify-center space-x-2">
            <span>
              <SquareUser size={30} />
            </span>
            <span>{opponent}</span>
          </div>
          {' '}
          <div className="flex justify-center p-3">
            <div className="border-2 ">
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
          <div className="flex flex-wrap justify-center space-x-2">
                  <span>
                    <SquareUser size={30} />
                  </span>
            <span>Me</span>
          </div>
          <div className="p-3 mx-5">
            {isViewingHistory && (
              <div className=" bg-yellow-500 text-black text-center py-1 text-sm font-bold z-10">
                Watching history
              </div>
            )}
          </div>
        </div>
        {/* Right */}
        <div className="rounded-4xl my-5 h-auto bg-muted shadow-lg shadow-ring select-none w-auto">
          <div className="flex flex-col p-6 space-y-6 w-auto">
            <div className="flex flex-col space-y-5 w-auto">
              
              <h1 className="flex justify-center text-4xl gap-1 font-bold tracking-tight self-center w-auto">
                <span>
                  {
                    isOnline ? (
                      <RiBaseStationLine />
                    ) : (
                      <FaRobot />
                    )
                  }
              </span>
                {isOnline ? 'Play Online' : 'Play with Bot'}
              </h1>

              </div>
              <div className="flex items-center hover:cursor-pointer self-center">
                <Combobox
                  gameType={gameTypes}
                  onSelect={setSelectedGameType}
                  defaultSelected={gameTypes?.[4]}
                />
              </div>
            {
              !isOnline &&
              (
                <div className="flex w-full h-full items-center justify-center space-x-8">
                  <div className="flex items-center space-x-1">
                    <span className="">Level</span>
                    <span className="w-2"> {strength}: </span>
                  </div>
                  <Slider className="size-1/2 mt-1"
                          onValueChange={(e) => setStrength(e[0])}
                          max={20}
                          min={-20}
                          step={1}
                          defaultValue={[0]}
                  />
                </div>
              )
            }
              <div className="flex self-center">
                <Button
                  className="text-3xl font-bold hovegr:text-4xl h-13 w-2xs"
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
              {' '}
              <div className="bg-background rounded-2xl w-full">
                <MovePosition
                  moves={history}
                  setRestoreHistory={getRestoreGame}
                  isViewingHistory={isViewingHistory}
                  onReturnToCurrentGame={handleReturnToCurrentGame}
                />
              </div>
              <div className="flex space-x-3 self-center">
                <Button className="group">
                  <Handshake className="text-green-500 transition-transform group-hover:scale-150" />
                </Button>
                <Button className="group">
                  <Flag className="transition-transform group-hover:scale-150"></Flag>
                </Button>
                <Button className="group">
                  <ChevronLeft className="text-gray-400 transition-transform group-hover:scale-150" />
                </Button>
                <Button className="group">
                  <ChevronRight className="text-gray-400 transition-transform group-hover:scale-150" />
                </Button>
                <Button className="group" onClick={togglePlayer}>
                  <ArrowUpDown className="text-blue-400 transition-transform group-hover:scale-150" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
      }
