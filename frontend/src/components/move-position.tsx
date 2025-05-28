import clsx from 'clsx';
import { useMemo } from 'react';
import { Button } from './ui/button';

function chunk<T>(arr: T[], size: number): T[][] {
  return arr.reduce((acc: T[][], _, index) => {
    if (index % size === 0) {
      acc.push(arr.slice(index, index + size));
    }
    return acc;
  }, []);
}
export type HistoryMove = {
  index: number;
  moves: string[];
  color?: 'white' | 'black'; // Optional color property
  fen?: string; // Optional FEN string for restoring game state
};
type MovePositionProps = {
  moves?: string[];
  setRestoreHistory: (state: HistoryMove) => void;
  isViewingHistory?: boolean;
  onReturnToCurrentGame?: () => void;
};
export default function MovePosition({
  moves,
  setRestoreHistory,
  isViewingHistory = false,
  onReturnToCurrentGame,
}: MovePositionProps) {
  const parsedMoves: HistoryMove[] = useMemo(() => {
    if (!moves || moves.length === 0) {
      return []; // Return empty array if moves is empty
    }
    const formatHistoryMove: HistoryMove[] = chunk(moves, 2).map(
      (move, index) => {
        return {
          index: index + 1,
          moves: move,
        };
      },
    );
    return formatHistoryMove;
  }, [moves]);
  return (
    <div className="border-2 rounded-2xl">
      <div className="p-3 font-bold text-2xl flex justify-center items-center">
        <span>Positions Board</span>
        {isViewingHistory && (
          <Button
            onClick={onReturnToCurrentGame}
            className="font-bold ml-4 text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return Game
          </Button>
        )}
      </div>
      <hr />
      <div className="p-3 overflow-y-auto h-70">
        {parsedMoves &&
          parsedMoves.length !== 0 &&
          parsedMoves.map((move, index) => {
            return (
              <div key={index} className={clsx('grid grid-cols-3')}>
                <div className="ml-10 ">
                  {index + 1}
                  <span>.</span>
                </div>{' '}
                {move.moves[0] && (
                  <div
                    className="font-bold flex justify-center hover:bg-accent hover:cursor-pointer"
                    onClick={() => {
                      setRestoreHistory({
                        ...move,
                        color: 'white',
                      });
                    }}
                  >
                    {move.moves[0]}
                  </div>
                )}
                {move.moves[1] && (
                  <div
                    className="font-bold flex justify-center hover:bg-accent hover:cursor-pointer"
                    onClick={() => {
                      setRestoreHistory({
                        ...move,
                        color: 'black',
                      });
                    }}
                  >
                    {move.moves[1]}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
