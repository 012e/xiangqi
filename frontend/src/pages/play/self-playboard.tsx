import { Chessboard } from 'react-xiangqiboard';
import { ChessboardProps } from 'react-xiangqiboard/dist/chessboard/types';
import Xiangqi from '@/lib/xiangqi';
import { useCallback, useState } from 'react';
import { HistoryMove } from '@/components/move-position';
import { useEffect } from 'react';
import useSettingStore from '@/stores/setting-store';
import { usePieceTheme } from '@/stores/setting-store';

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
  currentHistory?: string[];
  isViewingHistory?: boolean;
  onReturnToCurrentGame?: () => void;
} & Partial<ChessboardProps>;

const DEFAULT_PROPS: SelfPlayBoardProps = {};

export default function SelfPlayBoard({
  onMove,
  restoreGameState,
  currentHistory,
  isViewingHistory = false,
  onReturnToCurrentGame,
  ...chessboardProps
}: SelfPlayBoardProps = DEFAULT_PROPS) {
  const [game, setGame] = useState(new Xiangqi());
  const customPieces = usePieceTheme();
  const customBoard = useSettingStore(state => state.boardTheme);
  const [currentGame, setCurrentGame] = useState(new Xiangqi()); // Lưu trạng thái game hiện tại
  const handleMoveInternal = useCallback(
    (from: string, to: string, piece: string) => {
      // Nếu đang xem lịch sử, trở về trạng thái hiện tại và thử thực hiện nước đi
      if (isViewingHistory) {
        onReturnToCurrentGame?.();

        // Thực hiện nước đi trên trạng thái hiện tại
        const oldBoard: Xiangqi = structuredClone(currentGame);
        const newBoard: Xiangqi = Object.create(currentGame) as Xiangqi;

        setGame(newBoard);
        setCurrentGame(newBoard);
        onMove?.({
          from,
          to,
          piece,
          oldBoard,
          newBoard,
        });
        return true;
      }

      // Logic bình thường khi không xem lịch sử
      const oldBoard: Xiangqi = structuredClone(game);
      const newBoard: Xiangqi = Object.create(game) as Xiangqi;
      const move = newBoard.move({ from, to });
      if (move) {
        setGame(newBoard);
        setCurrentGame(newBoard); // Cập nhật trạng thái game hiện tại
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
    [game, onMove, isViewingHistory, onReturnToCurrentGame, currentGame],
  );

  function splitTwoParts(input: string): [string, string] | null {
    const regex = /^([a-i])(10|[1-9])([a-i])(10|[1-9])$/;
    const match = input.match(regex);

    if (!match) return null;

    const part1 = match[1] + match[2];
    const part2 = match[3] + match[4];

    return [part1, part2];
  }

  useEffect(() => {
    if (restoreGameState) {
      const newGame = new Xiangqi();
      if (restoreGameState.color === 'white') {
        for (let i = 1; i <= restoreGameState.index * 2 - 1; ++i) {
          const moveStr = currentHistory?.[i - 1];
          const parts = moveStr ? splitTwoParts(moveStr) : null;
          if (parts) {
            newGame.move({ from: parts[0], to: parts[1] });
          }
        }
        setGame(newGame);
      } else {
        for (let i = 1; i <= restoreGameState.index * 2; ++i) {
          const moveStr = currentHistory?.[i - 1];
          const parts = moveStr ? splitTwoParts(moveStr) : null;
          if (parts) {
            newGame.move({ from: parts[0], to: parts[1] });
          }
        }
        setGame(newGame);
      }
    } else {
      // Nếu không có restoreGameState, khôi phục về trạng thái hiện tại
      setGame(currentGame);
    }
  }, [currentHistory, restoreGameState, currentGame]);
  // Effect để cập nhật currentGame khi có lịch sử mới (chỉ khi không đang xem lịch sử)
  useEffect(() => {
    if (!isViewingHistory && currentHistory && currentHistory.length > 0) {
      const newGame = new Xiangqi();
      for (let i = 0; i < currentHistory.length; i++) {
        const moveStr = currentHistory[i];
        const parts = moveStr ? splitTwoParts(moveStr) : null;
        if (parts) {
          newGame.move({ from: parts[0], to: parts[1] });
        }
      }
      setCurrentGame(newGame);
      setGame(newGame); // Đồng bộ cả game hiện tại nếu không đang xem lịch sử
    }
  }, [currentHistory, isViewingHistory]);
  return (
    <Chessboard
      {...chessboardProps}
      boardWidth={400}
      id="online-xiangqi-board"
      onPieceDrop={handleMoveInternal}
      position={game.exportUciFen()}
      areArrowsAllowed={true}
      customPieces={customPieces}
      customBoardBackground={customBoard}
      arePiecesDraggable={true}
    />
  );
}
