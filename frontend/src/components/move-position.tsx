import clsx from 'clsx';
import React from 'react';

export type move = {
  id: number;
  black: string;
  white: string;
};
const DEFAULT_BOARD_POSITIONS = [
  { id: 1, white: 'e4', black: 'e5' },
  { id: 2, white: 'f4', black: 'f5' },
  { id: 3, white: 'g4', black: 'g5' },
  { id: 4, white: 'e4', black: 'e5' },
  { id: 5, white: 'f4', black: 'f5' },
  { id: 6, white: 'g4', black: 'g5' },
  { id: 7, white: 'e4', black: 'e5' },
  { id: 8, white: 'f4', black: 'f5' },
  { id: 9, white: 'g4', black: 'g5' },
  { id: 10, white: 'e4', black: 'e5' },
  { id: 11, white: 'f4', black: 'f5' },
  { id: 12, white: 'g4', black: 'g5' },
  { id: 13, white: 'e4', black: 'e5' },
  { id: 14, white: 'f4', black: 'f5' },
  { id: 15, white: 'g4', black: 'g5' },
];
export default function MovePosition({ moves = DEFAULT_BOARD_POSITIONS } : {
  moves?: move[]
}) {

  const [listMoves, ] = React.useState<move[]>(moves);

  return (
    <div className="border-2 rounded-2xl">
      <div className="p-3 font-bold text-2xl flex justify-center">
        Positions Board
      </div>
      <hr />
      <div className="p-3 overflow-y-auto h-70">
        {listMoves.length !== 0 &&
          listMoves.map((move, index) => {
            return (
              <div
                key={index}
                className={clsx(
                  'grid grid-cols-3 hover:cursor-pointer hover:pl-3 hover:bg-secondary',
                )}
              >
                <div className="ml-10 ">
                  {move.id}
                  <span>.</span>
                </div>
                {move.white && (
                  <div className="font-bold flex justify-center">
                    {move.white}
                  </div>
                )}
                {move.black && (
                  <div className="font-bold flex justify-center ">
                    {move.black}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
