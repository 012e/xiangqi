import { useParams } from 'react-router';
import { Chessboard } from 'react-xiangqiboard';
import { Square } from 'react-xiangqiboard/dist/chessboard/types';
import { useGameStore } from '@/stores/online-game-store'; // Import the store
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Loader2,
} from 'lucide-react';
import { useOnlineGame } from '@/lib/online/useOnlineGame';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import GameEndedDialog from '@/components/game-ended-dialog.tsx';
import { usePieceTheme } from '@/stores/setting-store';
import { PlayerCard } from '@/components/play/my-hover-card.tsx';
import { useMutation } from '@tanstack/react-query';
import { postAddFriend } from '@/lib/friend/useFriendRequestActions.ts';
import { toast } from 'sonner';
import { useState, useCallback, useEffect, useMemo } from 'react';
import MovePosition, { HistoryMove } from '@/components/move-position';
import Xiangqi from '@/lib/xiangqi';
import ResignButton from '../../components/ui/alert-resign.tsx';

export default function OnlineGame() {
  const { id } = useParams();
  const { onMove, isLoading, isPlayWithBot, resign } = useOnlineGame(id);
  const addFriend = useMutation({
    mutationFn: postAddFriend,
    onSuccess: () => {
      toast('Successfully added friend!');
    },
    onError: () => {
      toast('Fail add friend!');
    },
  });

  // History state management
  const [selectHistory, setSelectHistory] = useState<HistoryMove>();
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  const [currentGame, setCurrentGame] = useState<Xiangqi>(new Xiangqi());
  const [historicalGame, setHistoricalGame] = useState<Xiangqi>(new Xiangqi());

  // Get the time from the store

  const selfPlayer = useGameStore((state) => state.selfPlayer);
  const enemyPlayer = useGameStore((state) => state.enemyPlayer);
  const fen = useGameStore((state) => state.fen);
  const gameEnded = useGameStore((state) => state.isEnded);
  const gameState = useGameStore((state) => state.gameState);
  const pieceTheme = usePieceTheme();

  // Get game history from gameState
  const gameHistory = useMemo(() => gameState?.getHistory() || [], [gameState]);

  // History navigation functions
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
    if (historyIndex < 0 || historyIndex >= gameHistory.length) {
      return; // Out of bounds
    }

    const moveNumber = Math.floor(historyIndex / 2) + 1;
    const isWhiteMove = historyIndex % 2 === 0;

    const historyMove: HistoryMove = {
      index: moveNumber,
      moves: [
        gameHistory[moveNumber * 2 - 2] || '', // White move
        gameHistory[moveNumber * 2 - 1] || '', // Black move
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
    } else if (!isViewingHistory && gameHistory.length > 0) {
      // If not viewing history, start from the last move
      navigateToHistoryMove(gameHistory.length - 1);
    }
  }

  function handleNextMove() {
    if (isViewingHistory && currentHistoryIndex < gameHistory.length - 1) {
      navigateToHistoryMove(currentHistoryIndex + 1);
    } else if (
      isViewingHistory &&
      currentHistoryIndex === gameHistory.length - 1
    ) {
      // If at the end of history, return to the current game
      handleReturnToCurrentGame();
    }
  }

  // Initialize board orientation based on player colors
  const initialBottomPlayerColor = selfPlayer?.color || 'white'; // Default to 'red' or handle null
  const initialTopPlayerColor = enemyPlayer?.color || 'black'; // Default to 'black' or handle null

  const [bottomPlayerOrientation, setBottomPlayerOrientation] = useState<'white' | 'black'>(initialBottomPlayerColor === 'black' ? 'black' : 'white');
  const [topPlayerOrientation, setTopPlayerOrientation] = useState<'white' | 'black'>(initialTopPlayerColor === 'black' ? 'black' : 'white');

  // Function to toggle player card positions and board orientation
  function togglePlayer() {
    setBottomPlayerOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
    setTopPlayerOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  }

  function splitTwoParts(input: string): [string, string] | null {
    const regex = /^([a-i])(10|[1-9])([a-i])(10|[1-9])$/;
    const match = input.match(regex);

    if (!match) return null;

    const part1 = match[1] + match[2];
    const part2 = match[3] + match[4];

    return [part1, part2];
  }

  // Update the current game when gameState changes
  useEffect(() => {
    if (gameState && !isViewingHistory) {
      setCurrentGame(gameState);
    }
  }, [gameState, isViewingHistory]);

  // Handle history restoration
  useEffect(() => {
    if (selectHistory && gameHistory.length > 0) {
      const newGame = new Xiangqi();
      if (selectHistory.color === 'white') {
        for (let i = 1; i <= selectHistory.index * 2 - 1; ++i) {
          const moveStr = gameHistory[i - 1];
          const parts = moveStr ? splitTwoParts(moveStr) : null;
          if (parts) {
            newGame.move({ from: parts[0], to: parts[1] });
          }
        }
      } else {
        for (let i = 1; i <= selectHistory.index * 2; ++i) {
          const moveStr = gameHistory[i - 1];
          const parts = moveStr ? splitTwoParts(moveStr) : null;
          if (parts) {
            newGame.move({ from: parts[0], to: parts[1] });
          }
        }
      }
      setHistoricalGame(newGame);
    } else if (!isViewingHistory) {
      setHistoricalGame(currentGame);
    }
  }, [selectHistory, gameHistory, currentGame, isViewingHistory]);

  const handleMove = useCallback(
    (from: string, to: string, piece: string): boolean => {
      // If viewing history, return to the current game first
      if (isViewingHistory) {
        handleReturnToCurrentGame();
        // Don't make the move immediately, let the user try again
        return false;
      }

      return onMove(from, to, piece);
    },
    [onMove, isViewingHistory],
  );

  // Get the appropriate game state for display
  const displayGame = isViewingHistory ? historicalGame : currentGame;
  const displayFen = displayGame?.exportFen() || fen;

  // Format time from milliseconds to mm:ss:xx
  function formatTime(ms: number): string {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  function getPieceColor(piece: string): 'white' | 'black' {
    return piece[0] === 'b' ? 'black' : 'white';
  }

  function isPlayerTurn({
                          piece,
                        }: {
    piece: string;
    sourceSquare: Square;
  }): boolean {
    return getPieceColor(piece) === selfPlayer?.color;
  }

  // Determine which player card goes to the top and bottom
  const topPlayerCardProps = topPlayerOrientation === enemyPlayer?.color ? enemyPlayer : selfPlayer;
  const bottomPlayerCardProps = bottomPlayerOrientation === selfPlayer?.color ? selfPlayer : enemyPlayer;
  const boardDisplayOrientation: 'white' | 'black' = bottomPlayerOrientation; // The board should be oriented to the top player

  return (
    <div className="w-full text-foreground">
      <div className="grid grid-cols-1 items-start lg:grid-cols-[550px_400px]">
        {/* Left */}
        <div className="hidden p-4 mt-10 lg:block bg-background">
          <div className="flex items-center px-6 w-full">
            {/* Top Player Card */}
            {topPlayerCardProps && (
              <div className="flex flex-row items-center w-full">
                <PlayerCard
                  props={{
                    name: topPlayerCardProps.username,
                    elo: topPlayerCardProps.elo,
                    eloChange: topPlayerCardProps.eloChange,
                    image: isPlayWithBot && topPlayerCardProps.id === enemyPlayer?.id ? 'https://st5.depositphotos.com/72897924/62255/v/450/depositphotos_622556394-stock-illustration-robot-web-icon-vector-illustration.jpg' : topPlayerCardProps.picture,
                    isMe: topPlayerCardProps.id === selfPlayer?.id,
                    userId: topPlayerCardProps.id,
                    btnAddFriend: addFriend,
                  }}
                />
                <div className={`text-xl font-bold ml-auto`}>
                  {formatTime(topPlayerCardProps.time)}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center px-3 bg-background">
            <div className="flex flex-col items-center">
              <div className="flex justify-center items-center w-full">
                {isLoading ? (
                  <div className="flex justify-center items-center w-full h-full animate-spin">
                    <Loader2 />
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <Chessboard
                      boardWidth={400}
                      id="online-xiangqi-board"
                      onPieceDrop={handleMove}
                      isDraggablePiece={(piece) =>
                        isPlayerTurn(piece) && !gameEnded && !isViewingHistory
                      }
                      customPieces={pieceTheme}
                      boardOrientation={boardDisplayOrientation}
                      position={displayFen}
                      animationDuration={200}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center px-6 w-full">
            {/* Bottom Player Card */}
            {bottomPlayerCardProps && (
              <PlayerCard
                props={{
                  name: bottomPlayerCardProps.username,
                  elo: bottomPlayerCardProps.elo,
                  eloChange: bottomPlayerCardProps.eloChange,
                  image: isPlayWithBot && bottomPlayerCardProps.id === enemyPlayer?.id ? 'https://st5.depositphotos.com/72897924/62255/v/450/depositphotos_622556394-stock-illustration-robot-web-icon-vector-illustration.jpg' : bottomPlayerCardProps.picture,
                  isMe: bottomPlayerCardProps.id === selfPlayer?.id,
                  userId: bottomPlayerCardProps.id,
                  btnAddFriend: addFriend,
                }}
              />
            )}
            <div className={`text-xl font-bold ml-auto`}>
              {formatTime(bottomPlayerCardProps?.time)}
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
        <div className="my-5 shadow-lg rounded-4xl bg-muted shadow-ring">
          <div className="flex flex-col items-center p-6 space-y-6">
            {/*h1*/}
            <div>
              <h1 className="justify-center text-4xl font-bold tracking-tight">
                {isPlayWithBot ? 'Game with Bot' : 'Play Online'}
              </h1>
            </div>
            {/*broad move*/}
            <div className="w-full rounded-2xl bg-background">
              <MovePosition
                moves={gameHistory}
                setRestoreHistory={getRestoreGame}
                isViewingHistory={isViewingHistory}
                onReturnToCurrentGame={handleReturnToCurrentGame}
              />
            </div>
            {/*tools*/}
            <div className="flex space-x-3">
              <Button className="group">
                <Handshake className="text-green-500 transition-transform group-hover:scale-150" />
              </Button>
              <ResignButton onResign={resign} />

              <Button
                className="group"
                onClick={handlePreviousMove}
                disabled={isViewingHistory && currentHistoryIndex <= 0}
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
                  isViewingHistory &&
                  currentHistoryIndex >= gameHistory.length - 1
                }
              >
                <ChevronRight
                  className={`transition-transform group-hover:scale-150 ${
                    isViewingHistory &&
                    currentHistoryIndex >= gameHistory.length - 1
                      ? 'text-gray-600'
                      : 'text-gray-400'
                  }`}
                />
              </Button>
              <Button className="group" onClick={togglePlayer}>
                <ArrowUpDown className="text-blue-400 transition-transform group-hover:scale-150" />
              </Button>
            </div>
            <div className="grid gap-2 w-full">
              {!isPlayWithBot && (
                <div>
                  <Textarea
                    placeholder="Your Message"
                    className="pointer-events-none resize-none read-only:opacity-80 h-30"
                    readOnly
                  ></Textarea>
                  <Textarea
                    placeholder="Type your message here."
                    className="resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <GameEndedDialog />
    </div>
  );
}