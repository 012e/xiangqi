import { Chessboard } from 'react-xiangqiboard';
import { ChessboardProps } from 'react-xiangqiboard/dist/chessboard/types';
import Xiangqi from '@/lib/xiangqi';
import { useCallback, useState } from 'react';
import { HistoryMove } from '@/components/move-position';
import { useEffect } from 'react';
type MoveEvent = {
  from: string;
  to: string;
  piece: string;
  oldBoard: Xiangqi;
  newBoard: Xiangqi;
};

type SelfPlayBoardProps = {
  onMove?: (event: MoveEvent) => void;
  restoreGameState?: HistoryMove;
} & Partial<ChessboardProps>;

const DEFAULT_PROPS: SelfPlayBoardProps = {};

export default function SelfPlayBoard({
  onMove,
  restoreGameState,
  ...chessboardProps
}: SelfPlayBoardProps = DEFAULT_PROPS) {
  const [game, setGame] = useState(new Xiangqi());

  const handleMoveInternal = useCallback(
    (from: string, to: string, piece: string) => {
      const oldBoard: Xiangqi = structuredClone(game);
      const newBoard: Xiangqi = Object.create(game) as Xiangqi;
      const move = newBoard.move({ from, to });
      if (move) {
        setGame(newBoard);
        onMove?.({
          from,
          to,
          piece,
          oldBoard,
          newBoard,
        });
        return true;
      }
      return false;
    },
    [game, onMove],
  );

  useEffect(() => {
    if (restoreGameState?.fen) {
      setGame(new Xiangqi(restoreGameState.fen));
    }
  }, [restoreGameState]);

  return (
    <Chessboard
      {...chessboardProps}
      boardWidth={400}
      id="online-xiangqi-board"
      onPieceDrop={handleMoveInternal}
      position={game.exportUciFen()}
    />
  );
}
