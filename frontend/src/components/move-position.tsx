import clsx from 'clsx';
import { useMemo } from 'react';

function chunk<T>(arr: T[], size: number): T[][] | undefined {
  return arr.reduce((acc: T[][], _, index) => {
    if (index % size === 0) {
      acc.push(arr.slice(index, index + size));
    }
    return acc;
  }, []);
}

export default function MovePosition({ moves }: { moves?: string[] }) {
  const parsedMoves: string[][] | undefined = useMemo(() => {
    if (!moves || moves.length === 0) {
      return undefined; // Return undefined if moves is empty
    }
    return chunk(moves, 2);
  }, [moves]);
  return (
    <div className="border-2 rounded-2xl">
      <div className="p-3 font-bold text-2xl flex justify-center">
        Positions Board
      </div>
      <hr />
      <div className="p-3 overflow-y-auto h-70">
        {parsedMoves &&
          parsedMoves.length !== 0 &&
          parsedMoves.map((move, index) => {
            return (
              <div
                key={index}
                className={clsx(
                  'grid grid-cols-3 hover:cursor-pointer hover:pl-3 hover:bg-secondary',
                )}
              >
                <div className="ml-10 ">
                  {index + 1}
                  <span>.</span>
                </div>
                {move[0] && (
                  <div className="font-bold flex justify-center">{move[0]}</div>
                )}
                {move[1] && (
                  <div className="font-bold flex justify-center ">
                    {move[1]}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
