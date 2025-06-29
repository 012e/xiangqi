import { useParams } from 'react-router';
import { Chessboard } from 'react-xiangqiboard';
import { Square } from 'react-xiangqiboard/dist/chessboard/types';
import { useGameStore } from '@/stores/online-game-store'; // Import the store
import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useOnlineGame } from '@/lib/online/useOnlineGame';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import GameEndedDialog from '@/components/game-ended-dialog.tsx';
import { usePieceTheme } from '@/stores/setting-store';
import { PlayerCard } from '@/components/play/my-hover-card.tsx';
import { addFriend as addFriend } from '@/lib/friend/useFriendRequestActions.ts';
import { useState, useCallback, useEffect, useMemo } from 'react';
import OfferDrawButton from '@/components/ui/offer-draw-button.tsx';
import MovePosition, { HistoryMove } from '@/components/move-position';
import Xiangqi from '@/lib/xiangqi';
import ResignButton from '../../components/ui/alert-resign.tsx';
import { cn } from '@/lib/utils.ts';
import AppBoard from '@/components/app-board.tsx';

export default function OnlineGame() {
  const { id } = useParams();
  const { onMove, isLoading, isPlayWithBot, resign, offerDraw, declineDraw } =
    useOnlineGame(id);

  const enemyOfferingDraw = useGameStore(
    (state) => state.enemyPlayer.isOfferingDraw,
  );
  const currentPlayerOfferingDraw = useGameStore(
    (state) => state.selfPlayer.isOfferingDraw,
  );

  // History state management
  const [selectHistory, setSelectHistory] = useState<HistoryMove>();
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  const [currentGame, setCurrentGame] = useState<Xiangqi>(new Xiangqi());
  const [historicalGame, setHistoricalGame] = useState<Xiangqi>(new Xiangqi());
  const [isRotated, setIsRotated] = useState(false);

  const selfPlayer = useGameStore((state) => state.selfPlayer);
  const enemyPlayer = useGameStore((state) => state.enemyPlayer);
  const fen = useGameStore((state) => state.fen);
  const gameEnded = useGameStore((state) => state.isEnded);
  const gameState = useGameStore((state) => state.gameState);
  const pieceTheme = usePieceTheme();

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

  function togglePlayer() {
    setIsRotated((prev) => !prev);
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

  function handlePieceClick() {

  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2" key={id}>
      {/* Left */}
      <div>
        <div
          className={cn(
            'flex flex-col justify-center items-center p-10 bg-background',
            isRotated ? 'flex-col-reverse' : '',
          )}
        >
          <PlayerCard player={enemyPlayer} onAddFriend={addFriend} />

          <div className="flex justify-center items-center w-full">
            {isLoading ? (
              <div className="flex justify-center items-center w-full h-full animate-spin">
                <Loader2 />
              </div>
            ) : (
              <AppBoard
                id="online-xiangqi-board"
                boardWidth={400}
                onPieceDrop={handleMove}
                isDraggablePiece={(piece) =>
                  isPlayerTurn(piece) && !gameEnded && !isViewingHistory
                }
                boardOrientation={
                  isRotated ? enemyPlayer?.color : selfPlayer?.color
                }
                position={displayFen}
                animationDuration={200}
              />
            )}
          </div>

          <PlayerCard player={selfPlayer} isCurrentPlayer={true} />
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
      <div className="m-5 shadow-lg rounded-4xl bg-muted shadow-ring">
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
          {currentPlayerOfferingDraw && (
            <div className="p-1 font-bold tracking-tight text-center text-black bg-yellow-300 rounded-xs">
              You have offered a draw. Waiting for the opponent's response.
            </div>
          )}
          <div className="flex space-x-3">
            <OfferDrawButton
              onDrawOffer={offerDraw}
              onRejectDrawOffer={declineDraw}
              showRejectPopup={enemyOfferingDraw}
            />
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
      <GameEndedDialog />
    </div>
  );
}

