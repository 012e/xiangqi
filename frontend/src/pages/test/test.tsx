import { Button } from '@/components/ui/button.tsx';
import { useState } from 'react';
import SelfPlayBoard from '../play/self-playboard.tsx';
import { ArrowUpDown, ChevronLeft, ChevronRight, CircleUser, Flag, Handshake, Loader2 } from 'lucide-react';
import MovePosition from '@/components/move-position.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { useGameStore } from '@/stores/online-game-store.ts';
import { Square } from 'react-xiangqiboard/dist/chessboard/types';
import { Chessboard } from 'react-xiangqiboard';

export default function Demo() {
  const [, setPlayer] = useState<'white' | 'black'>('white');
  // const { id } = useParams();
  // const { game, onMove, isLoading } = useOnlineGame(id);

  // Get the time from the store
  const blackTime = useGameStore((state) => state.blackTime);
  const whiteTime = useGameStore((state) => state.whiteTime);
  const playingColor = useGameStore((state) => state.playingColor);
  const playerColor = useGameStore((state) => state.playerColor);
  // const fen = useGameStore((state) => state.fen);
  // const gameEnded = useGameStore((state) => state.isEnded);

  // Format time from milliseconds to mm:ss:xx
  function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiSeconds = Math.floor((ms % 1000) / 10);

    const base = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (ms < 5 * 60 * 1000) {
      return `${base}.${centiSeconds.toString().padStart(2, '0')}`;
    }

    return base;
  }

  function getPieceColor(piece: string): 'white' | 'black' {
    return piece[0] === 'b' ? 'black' : 'white';
  }

  function isPlayerTurn({ piece }: {
    piece: string;
    sourceSquare: Square;
  }): boolean {
    return getPieceColor(piece) === playerColor;
  }

  function togglePlayer() {
    setPlayer((prev) => (prev === 'white' ? 'black' : 'white'));
  }

  return (
    <div className="w-full text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-[550px_400px] items-start">
        {/* Left */}
        <div className="p-4 lg:block hidden mt-10 bg-background">
          <div className="flex flex-wrap space-x-2 px-10 w-full">
            <div className="flex flex-wrap space-x-2">
              <span><CircleUser size={30} /></span>
              <span>opp</span>
            </div>
            <div
              className={`text-xl font-bold ml-auto ${
                playingColor === 'black' ? 'text-red-600' : ''
              }`}
            >
              {formatTime(blackTime)}
            </div>
          </div>
          <div className="flex justify-center p-3">
            <div className="border-2">
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
            </div>
          </div>
          <div className="flex flex-wrap space-x-2 px-10 w-full">
            <div className="flex flex-wrap space-x-2">
              <span><CircleUser size={30} /></span>
              <span>Me</span>
            </div>
            <div
              className={`text-xl font-bold ml-auto ${
                playingColor === 'white' ? '' : ''
              }`}
            >
              {formatTime(whiteTime)}
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="rounded-4xl my-5 bg-muted shadow-lg shadow-ring">
          <div className="flex flex-col items-center p-6 space-y-6">
            {/*h1*/}
            <div>
              <h1 className="text-4xl font-bold justify-center tracking-tight">
                Play Online
              </h1>
            </div>
            {/*broad move*/}
            <div className="bg-background rounded-2xl w-full">
              <MovePosition moves={[]}></MovePosition>
            </div>
            {/*tools*/}
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
            <div className="grid gap-2 w-full">
              <Textarea placeholder="Your Message"
                        className="resize-none read-only:opacity-80 pointer-events-none h-30 " readOnly></Textarea>
              <Textarea placeholder="Type your message here." className="resize-none " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
