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
import { useState } from 'react';
import MovePosition, { HistoryMove } from '@/components/move-position';
import { useCreateGame } from '@/stores/useCreateGame.ts';
import { useQuery } from '@tanstack/react-query';
import { GameType, getGameTypes } from '@/lib/online/game-type.ts';
import { Slider } from '@/components/ui/slider.tsx';
import { RiBaseStationLine } from 'react-icons/ri';
import { FaRobot } from 'react-icons/fa';

export default function PlayOnline({
  isGameWithBot: isOnline,
}: {
  isGameWithBot: boolean;
}) {
  const { createGame, loading } = useCreateGame();

  const [selectHistory, setSelectHistory] = useState<HistoryMove>();
  const [history, setHistory] = useState<string[]>([]);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

  const [player, setPlayer] = useState<'white' | 'black'>('white');

  const { data: gameTypes, isLoading: gameTypesLoading } = useQuery({
    queryKey: ['gameTypes'],
    queryFn: getGameTypes,
    // Enable optimistic updates from cache
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    // Show cached data immediately while refetching in background
    refetchOnMount: 'always',
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
    // Reset history navigation when new moves are made
    if (!isViewingHistory) {
      setCurrentHistoryIndex(-1);
    }
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
    // Calculate the current index based on the move and color
    const moveIndex = state.index;
    if (state.color === 'white') {
      setCurrentHistoryIndex(moveIndex * 2 - 2); // White moves are at even indices (0, 2, 4...)
    } else {
      setCurrentHistoryIndex(moveIndex * 2 - 1); // Black moves are at odd indices (1, 3, 5...)
    }
  }

  function handleReturnToCurrentGame() {
    setSelectHistory(undefined);
    setIsViewingHistory(false);
    setCurrentHistoryIndex(-1);
  }

  function navigateToHistoryMove(historyIndex: number) {
    if (historyIndex < 0 || historyIndex >= history.length) {
      return; // Out of bounds
    }

    const moveNumber = Math.floor(historyIndex / 2) + 1;
    const isWhiteMove = historyIndex % 2 === 0;

    const historyMove: HistoryMove = {
      index: moveNumber,
      moves: [
        history[moveNumber * 2 - 2] || '', // White move
        history[moveNumber * 2 - 1] || '', // Black move
      ].filter((move) => move !== ''),
      color: isWhiteMove ? 'white' : 'black',
    };

    setSelectHistory(historyMove);
    setIsViewingHistory(true);
    setCurrentHistoryIndex(historyIndex);
  }

  function handlePreviousMove() {
    if (isViewingHistory && currentHistoryIndex > 0) {
      navigateToHistoryMove(currentHistoryIndex - 1);
    } else if (!isViewingHistory && history.length > 0) {
      // If not viewing history, start from the last move
      navigateToHistoryMove(history.length - 1);
    }
  }

  function handleNextMove() {
    if (isViewingHistory && currentHistoryIndex < history.length - 1) {
      navigateToHistoryMove(currentHistoryIndex + 1);
    } else if (isViewingHistory && currentHistoryIndex === history.length - 1) {
      // If at the end of history, return to current game
      handleReturnToCurrentGame();
    }
  }

  return (
    <div className="w-full h-full text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full justify-center items-center p-10">
        {/* Left */}
        <div className="w-full h-full">
          <div className="flex flex-col justify-center items-center bg-background w-full h-full gap-3">
            <div className="flex justify-center items-center">
            <span>
              <SquareUser size={30} />
            </span>
              <span>Opponent</span>
            </div>
            <div className="flex justify-center items-center">
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
            <div className="flex flex-wrap justify-center space-x-2">
              <span>
                <SquareUser size={30} />
              </span>
                <span>Me</span>
            </div>
          </div>
          <div className="p-3 mx-5">
            {isViewingHistory && (
              <div className="z-10 py-1 text-sm font-bold text-center text-black bg-yellow-500">
                Watching history
              </div>
            )}
          </div>
        </div>
        {/* Right */}
        <div className="m-5 w-auto h-auto select-none shadow-lg rounded-4xl bg-muted shadow-ring">
          <div className="flex flex-col p-6 space-y-6 w-auto">
            <div className="flex flex-col space-y-5 w-auto">
              <h1 className="flex gap-1 justify-center self-center w-auto text-4xl font-bold tracking-tight">
                <span>{isOnline ? <RiBaseStationLine /> : <FaRobot />}</span>
                {isOnline ? 'Play Online' : 'Play with Bot'}
              </h1>
            </div>
            <div className="flex items-center self-center hover:cursor-pointer">
              <Combobox
                gameType={gameTypes}
                onSelect={setSelectedGameType}
                defaultSelected={gameTypes?.[4]}
                isLoading={gameTypesLoading}
              />
            </div>
            {!isOnline && (
              <div className="flex justify-center items-center space-x-8 w-full h-full">
                <div className="flex items-center space-x-1">
                  <span className="">Level</span>
                  <span className="w-2"> {strength}: </span>
                </div>
                <Slider
                  className="mt-1 size-1/2"
                  onValueChange={(e) => setStrength(e[0])}
                  max={20}
                  min={-20}
                  step={1}
                  defaultValue={[0]}
                />
              </div>
            )}
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
            </div>{' '}
            <div className="w-full rounded-2xl bg-background">
              <MovePosition
                moves={history}
                setRestoreHistory={getRestoreGame}
                isViewingHistory={isViewingHistory}
                onReturnToCurrentGame={handleReturnToCurrentGame}
              />
            </div>
            <div className="flex self-center space-x-3">
              <Button className="group" disabled={true}>
                <Handshake className="text-green-500 transition-transform group-hover:scale-150" />
              </Button>
              <Button className="group" disabled={true}>
                <Flag className="transition-transform group-hover:scale-150"></Flag>
              </Button>
              <Button
                className="group"
                onClick={handlePreviousMove}
                disabled={
                  history.length == 0 ||
                  (isViewingHistory && currentHistoryIndex <= 0)
                }
              >
                <ChevronLeft
                  className={`transition-transform group-hover:scale-150 ${
                    isViewingHistory && currentHistoryIndex <= 0
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                />
              </Button>
              <Button
                className="group"
                onClick={handleNextMove}
                disabled={
                  history.length == 0 ||
                  (isViewingHistory &&
                    currentHistoryIndex >= history.length - 1)
                }
              >
                <ChevronRight
                  className={`transition-transform group-hover:scale-150 ${
                    isViewingHistory &&
                    currentHistoryIndex >= history.length - 1
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                />
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
