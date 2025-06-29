import { useParams } from 'react-router';
import { Square } from 'react-xiangqiboard/dist/chessboard/types';
import { useGameStore } from '@/stores/online-game-store'; // Import the store
import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useOnlineGame } from '@/lib/online/useOnlineGame';
import { Button } from '@/components/ui/button.tsx';
import GameEndedDialog from '@/components/game-ended-dialog.tsx';
import { PlayerCard } from '@/components/play/my-hover-card.tsx';
import { addFriend as addFriend } from '@/lib/friend/useFriendRequestActions.ts';
import { useState, useCallback, useEffect, useMemo } from 'react';
import React from 'react';
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
  const [historicalGame, setHistoricalGame] = useState<Xiangqi>(new Xiangqi());
  const [isRotated, setIsRotated] = useState(false);

  // Click-to-move state management
  const [selectedSquare, setSelectedSquare] = useState<string>('');
  const [optionSquares, setOptionSquares] = useState({});

  const selfPlayer = useGameStore((state) => state.selfPlayer);
  const enemyPlayer = useGameStore((state) => state.enemyPlayer);
  const fen = useGameStore((state) => state.fen);
  const gameEnded = useGameStore((state) => state.isEnded);
  const gameState = useGameStore((state) => state.gameState);

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
    // Clear selection when returning to current game
    setSelectedSquare('');
    setOptionSquares({});
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

  // Handle history restoration
  useEffect(() => {
    // Only run this logic when actively viewing a point in history
    if (isViewingHistory && currentHistoryIndex >= 0) {
      const newGame = new Xiangqi(); // Start from the initial board
      // Replay moves from the beginning up to the current history index
      for (let i = 0; i <= currentHistoryIndex; i++) {
        const moveStr = gameHistory[i];
        const parts = moveStr ? splitTwoParts(moveStr) : null;
        if (parts) {
          newGame.move({ from: parts[0], to: parts[1] });
        }
      }
      setHistoricalGame(newGame);
    } else if (!isViewingHistory) {
      setHistoricalGame(gameState);
    }
  }, [isViewingHistory, currentHistoryIndex, gameHistory, gameState]);

  // Clear selection when game state changes
  useEffect(() => {
    if (!isViewingHistory) {
      setSelectedSquare('');
      setOptionSquares({});
    }
  }, [gameState, isViewingHistory]);

  const handleMove = useCallback(
    (from: string, to: string, piece: string): boolean => {
      // If viewing history, return to the current game first
      if (isViewingHistory) {
        handleReturnToCurrentGame();
        // Don't make the move immediately, let the user try again
        return false;
      }

      return onMove(from, to);
    },
    [onMove, isViewingHistory],
  );

  // Get the appropriate game state for display. Use `gameState` from the store as the source of truth.
  const displayGame = isViewingHistory ? historicalGame : gameState;
  const displayFen = displayGame?.exportFen() || fen;

  function getPieceColor(piece: string): 'white' | 'black' {
    return piece[0] === 'b' ? 'black' : 'white';
  }

  function isPlayerTurn({
    piece,
    sourceSquare,
  }: {
    piece: string;
    sourceSquare: Square;
  }): boolean {
    return getPieceColor(piece) === selfPlayer?.color;
  }

  function handlePieceClick(_piece: string, square: string) {
    // When clicking on a piece, treat it as a square click
    handleSquareClick(square);
  }

  function handleSquareClick(square: string) {
    // If viewing history, don't allow interactions
    if (isViewingHistory) {
      return;
    }

    // If game has ended, don't allow interactions
    if (gameEnded) {
      return;
    }

    const gameState = displayGame.getState();

    // If we have a selected piece and click on a different square, try to move
    if (selectedSquare && selectedSquare !== square) {
      const moves = displayGame.getLegalMoves(selectedSquare, true);

      // Check if the clicked square is a legal move
      if (moves.includes(square)) {
        const [fromRow, fromCol] = displayGame.positionToCoordinates(selectedSquare);
        const piece = gameState.board[fromRow][fromCol];
        const moveSuccess = handleMove(selectedSquare, square, piece || '');

        if (moveSuccess) {
          // Clear selection and highlights after successful move
          setSelectedSquare('');
          setOptionSquares({});
          return;
        }
      }

      // If move failed or clicked on invalid square, clear selection
      setSelectedSquare('');
      setOptionSquares({});

      // Check if clicked square has a piece to select (only our own pieces)
      const [clickedRow, clickedCol] = displayGame.positionToCoordinates(square);
      const clickedPiece = gameState.board[clickedRow][clickedCol];
      if (clickedPiece) {
        // Check if it's the current player's piece AND it's their turn
        const pieceColor = getPieceColor(clickedPiece);
        const isCurrentPlayerPiece = pieceColor === selfPlayer?.color;
        const isPlayerTurn = gameState.currentPlayer === (selfPlayer?.color === 'white' ? 'w' : 'b');

        if (isCurrentPlayerPiece && isPlayerTurn) {
          highlightMoves(square);
          setSelectedSquare(square);
        }
      }
      return;
    }

    // If clicking on the same selected square, deselect it
    if (selectedSquare === square) {
      setSelectedSquare('');
      setOptionSquares({});
      return;
    }

    // If no piece selected, try to select the clicked piece (only our own pieces)
    const [row, col] = displayGame.positionToCoordinates(square);
    const piece = gameState.board[row][col];
    if (piece) {
      // Check if it's the current player's piece AND it's their turn
      const pieceColor = getPieceColor(piece);
      const isCurrentPlayerPiece = pieceColor === selfPlayer?.color;
      const isPlayerTurn = gameState.currentPlayer === (selfPlayer?.color === 'white' ? 'w' : 'b');

      if (isCurrentPlayerPiece && isPlayerTurn) {
        highlightMoves(square);
        setSelectedSquare(square);
      }
    } else {
      // Clicked on empty square with no selection
      setSelectedSquare('');
      setOptionSquares({});
    }
  }

  function highlightMoves(square: string) {
    const moves = displayGame.getLegalMoves(square, true);

    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const gameState = displayGame.getState();
    const newSquares: Record<string, React.CSSProperties> = {};

    moves.forEach(move => {
      // Check if there's a piece at the target square (can be attacked)
      const [targetRow, targetCol] = displayGame.positionToCoordinates(move);
      const targetPiece = gameState.board[targetRow][targetCol];

      if (targetPiece) {
        // There's a piece that can be attacked - show green background
        newSquares[move] = {
          background: '#008000',
          borderRadius: '20%',
          position: 'relative',
          zIndex: 999,
        };
      } else {
        // Empty square - show normal move indicator
        newSquares[move] = {
          background: 'radial-gradient(circle, rgba(0,0,0,.2) 25%, transparent 25%)',
          borderRadius: '20%',
          position: 'relative',
          zIndex: 999,
        };
      }
    });

    // Highlight the selected piece
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
      borderRadius: '10%',
      zIndex: 10,
    };

    setOptionSquares(newSquares);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full justify-center items-center p-10" key={id}>
      {/* Left */}
      <div className="w-full h-auto">
        <div
          className={cn(
            'flex flex-col justify-center items-center bg-background w-full',
            isRotated ? 'flex-col-reverse' : '',
          )}
        >
          <div className="flex justify-center items-center w-full pl-5 pr-7">
            <PlayerCard player={enemyPlayer} onAddFriend={addFriend} />
          </div>

          <div className="flex justify-center items-center w-full">
            {isLoading ? (
              <div className="flex justify-center items-center w-full h-full animate-spin">
                <Loader2 />
              </div>
            ) : (
              <AppBoard
                id="online-xiangqi-board"
                boardWidth={500}
                onPieceDrop={handleMove}
                onSquareClick={handleSquareClick}
                onPieceClick={handlePieceClick}
                customSquareStyles={{
                  ...optionSquares,
                }}
                isDraggablePiece={(piece) =>
                  isPlayerTurn(piece) && !gameEnded && !isViewingHistory
                }
                boardOrientation={
                  isRotated ? enemyPlayer?.color : selfPlayer?.color
                }
                position={displayFen}
                animationDuration={200}
                areArrowsAllowed={true}
                arePiecesDraggable={true}
              />
            )}
          </div>
          <div className="flex justify-center items-center w-full pl-5 pr-7">
            <PlayerCard player={selfPlayer} isCurrentPlayer={true} />
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
        </div>
      </div>
      <GameEndedDialog />
    </div>
  );
}
