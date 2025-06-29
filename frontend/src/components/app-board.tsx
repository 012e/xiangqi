import { ChessboardProps } from 'react-xiangqiboard/dist/chessboard/types';
import { Chessboard } from 'react-xiangqiboard';
import useSettingStore, { usePieceTheme } from '@/stores/setting-store.ts';

export default function AppBoard(props: ChessboardProps) {
  const customPieces = usePieceTheme();
  const customBoard = useSettingStore(state => state.boardTheme);

  return <Chessboard {...props}
                     customPieces={customPieces}
                     customBoardBackground={customBoard}
  />;
}