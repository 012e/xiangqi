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
import MovePosition, { HistoryMove } from '@/components/move-position';
import { useCreateGame } from '@/stores/useCreateGame.ts';
import { useQuery } from '@tanstack/react-query';
import { GameType, getGameTypes } from '@/lib/online/game-type.ts';
import { set } from 'zod';

export default function PlayOnline() {
  const [currentFen, setCurrentFen] = useState<string>('');
  const { createGame, loading } = useCreateGame();
  const [selectHistory, setSelectHistory] = useState<HistoryMove>();
  const [history, setHistory] = useState<string[]>([]);
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
  function updateHistory(history: string[]) {
    setHistory([...history]);
  }

  function handleCreateGame() {
    if (selectedGameType) {
      return createGame(selectedGameType.id);
    }
  }
  function getRestoreGame(state: HistoryMove) {
    setSelectHistory(state);
    if (state.color === 'white') {
      const slicedFen = sliceFen(currentFen, state.index * 2 - 1);
      setCurrentFen(slicedFen);
    } else {
      const slicedFen = sliceFen(currentFen, state.index * 2);
      setCurrentFen(slicedFen);
    }
  }

  function sliceFen(fen: string, index: number): string {
    const [positionPart, movePart] = fen.split('|').map((part) => part.trim());

    if (!movePart) return fen;

    const moves = movePart.split(/\s+/);
    const slicedMoves = moves.slice(0, index);
    return `${positionPart} | ${slicedMoves.join(' ')}`;
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
          </div>{' '}
          <div className="flex justify-center p-3">
            <div className="border-2">
              <SelfPlayBoard
                boardOrientation={player}
                onMove={({ newBoard }) => {
                  setCurrentFen(newBoard.exportUciFen());
                  updateHistory(newBoard.getHistory());
                }}
                restoreGameState={selectHistory}
              />
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
        <div className="rounded-4xl my-5 h-165 bg-muted shadow-lg shadow-ring select-none">
          <div className="min-h-screen flex flex-col items-center p-6 space-y-6">
            <div>
              <h1 className="text-4xl font-bold justify-center tracking-tight">
                Play Online
              </h1>
            </div>
            <div className="flex items-center hover:cursor-pointer">
              <Combobox
                gameType={gameTypes}
                onSelect={setSelectedGameType}
                defaultSelected={gameTypes?.[4]}
              />
            </div>
            <div>
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
            </div>{' '}
            <div className="bg-background rounded-2xl w-full">
              <MovePosition
                moves={history}
                setRestoreHistory={getRestoreGame}
              />
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
