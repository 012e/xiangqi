import { useParams } from 'react-router';
import { Chessboard } from 'react-xiangqiboard';
import { Square } from 'react-xiangqiboard/dist/chessboard/types';
import { useGameStore } from '@/stores/online-game-store'; // Import the store
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Flag,
  Handshake,
  Loader2,
} from 'lucide-react';
import { useOnlineGame } from '@/lib/online/useOnlineGame';
// import MovePosition from '@/components/move-position.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import GameEndedDialog from '@/components/game-ended-dialog.tsx';
import useSettingStore from '@/stores/setting-store';
import { MyHoverCard } from '@/components/play/my-hover-card.tsx';
import { useMutation } from '@tanstack/react-query';
import { postAddFriend } from '@/lib/friend/useFriendRequestActions.ts';
import { toast } from 'sonner';

export default function OnlineGame() {
  const { id } = useParams();
  const { onMove, isLoading } = useOnlineGame(id);
  const addFriend = useMutation({
    mutationFn: postAddFriend,
    onSuccess: () => {
      toast('Successfully added friend!');
      console.log('Successfully')
    },
    onError: () => {
      toast('Fail add friend!');
      console.log('fail')
    },
  });
  // Get the time from the store

  const selfPlayer = useGameStore((state) => state.selfPlayer);
  const enemyPlayer = useGameStore((state) => state.enemyPlayer);
  const fen = useGameStore((state) => state.fen);
  const gameEnded = useGameStore((state) => state.isEnded);
  const pieceTheme = useSettingStore(state => state.pieceTheme);

  // Format time from milliseconds to mm:ss:xx
  function formatTime(ms: number): string {
    // return ms.toString();
    // example: 137608 (s)
    const totalSeconds = Math.round(ms / 1000); // 138
    const minutes = Math.floor(totalSeconds / 60); // 2
    const seconds = totalSeconds % 60; // 18
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
  return (
    <div className="w-full text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-[550px_400px] items-start">
        {/* Left */}
        <div className="p-4 lg:block hidden mt-10 bg-background">
          <div className="flex items-center px-6 w-full">
            <MyHoverCard props={{
              name: enemyPlayer.username,
              score: 0,
              image: enemyPlayer.picture,
              isMe: false,
              userId: enemyPlayer.id, // Add user ID for friend request
              btnAddFriend: addFriend,
            }} />
            <div className={`text-xl font-bold ml-auto`}>
              {formatTime(enemyPlayer?.time)}
            </div>
          </div>
          <div className="flex justify-center items-center px-3 bg-background ">
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
                      onPieceDrop={onMove}
                      isDraggablePiece={(piece) =>
                        isPlayerTurn(piece) && !gameEnded
                      }
                      customPieces={pieceTheme}
                      boardOrientation={selfPlayer?.color}
                      position={fen}
                      animationDuration={200}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center px-6 w-full">
            <MyHoverCard props={{
              name: selfPlayer.username,
              score: 0,
              image: selfPlayer.picture,
              isMe: true,
            }} />
            <div className={`text-xl font-bold ml-auto`}>
              {formatTime(selfPlayer?.time)}
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
              {/* <MovePosition moves={[]}></MovePosition> */}
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
              <Button className="group">
                <ArrowUpDown className="transition-transform group-hover:scale-150 text-blue-400" />
              </Button>
            </div>
            <div className="grid gap-2 w-full">
              <Textarea
                placeholder="Your Message"
                className="resize-none read-only:opacity-80 pointer-events-none h-30 "
                readOnly
              ></Textarea>
              <Textarea
                placeholder="Type your message here."
                className="resize-none "
              />
            </div>
          </div>
        </div>
      </div>
      <GameEndedDialog />
    </div>
  );
}
