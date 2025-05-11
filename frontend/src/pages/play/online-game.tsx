import { useParams } from 'react-router';
import { Chessboard } from 'react-xiangqiboard';
import { Square } from 'react-xiangqiboard/dist/chessboard/types';
import { useGameStore } from '@/stores/online-game-store'; // Import the store
import { Loader2 } from 'lucide-react';
import { useOnlineGame } from '@/lib/online/useOnlineGame';
import GameEndedDialog from '@/components/game-ended-dialog';

export default function OnlineGame() {
  const { id } = useParams();
  const { game, onMove, isLoading } = useOnlineGame(id);

  // Get the time from the store
  const blackTime = useGameStore((state) => state.blackTime);
  const whiteTime = useGameStore((state) => state.whiteTime);
  const playingColor = useGameStore((state) => state.playingColor);
  const playerColor = useGameStore((state) => state.playerColor);
  const fen = useGameStore((state) => state.fen);
  const gameEnded = useGameStore((state) => state.isEnded);

  // Format time from milliseconds to MM:SS
  function formatTime(ms: number): string {
    //const totalSeconds = Math.round(ms / 1000);
    //const minutes = Math.floor(totalSeconds / 60);
    //const seconds = totalSeconds % 60;
    //return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return ms.toString();
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
    return getPieceColor(piece) === playerColor;
  }

  return (
    <div className="flex flex-col gap-10 justify-center items-center p-20">
      {/* Timer display */}
      <div className="flex justify-between w-full max-w-md">
        <div
          className={`text-xl font-bold ${
            playingColor === 'black' ? 'text-red-600' : ''
          }`}
        >
          Black: {formatTime(blackTime)}
        </div>
        <div
          className={`text-xl font-bold ${
            playingColor === 'white' ? 'text-red-600' : ''
          }`}
        >
          White: {formatTime(whiteTime)}
        </div>
      </div>

      <h1>{game.exportFen()}</h1>
      {isLoading ? (
        <div className="flex justify-center w-full h-full animate-spin items-enter">
          <Loader2 />{' '}
        </div>
      ) : (
        <div className="w-1/2 h-1/2">
          <Chessboard
            boardWidth={400}
            id="online-xiangqi-board"
            onPieceDrop={onMove}
            isDraggablePiece={(piece) => isPlayerTurn(piece) && !gameEnded}
            boardOrientation={playerColor}
            position={fen}
            animationDuration={200}
          />
        </div>
      )}
      <GameEndedDialog />
    </div>
  );
}
