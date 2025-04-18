import { Chessboard } from 'react-xiangqiboard';
import { ChessboardProps } from 'react-xiangqiboard/dist/chessboard/types';
import { useState } from 'react';
import Xiangqi from '@/lib/xiangqi';

export default function SelfPlayBoard(props: ChessboardProps) {
  const [game, setGame] = useState(new Xiangqi());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onMove(from: string, to: string, _piece: string): boolean {
    const gameCopy: Xiangqi = Object.create(game) as Xiangqi;
    const move = gameCopy.move({ from, to });
    setGame(gameCopy);
    if (!move) return false;
    return true;
  }

  return (
    <Chessboard
      {...props}
      boardWidth={400}
      id="online-xiangqi-board"
      onPieceDrop={onMove}
      position={game.exportFen()}
    />
  );
}
