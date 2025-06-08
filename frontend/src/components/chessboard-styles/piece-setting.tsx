import { IconKingBlack, IconKingRed } from './pieces-styles/chinese-pieces';
import { cn } from '@/lib/utils';
import * as RadioGroup from '@radix-ui/react-radio-group';
import {
  BlackKingPiece,
  RedKingPiece,
} from './pieces-styles/clubxiangqi-pieces';
import {
  BlackKingPieceOk,
  RedKingPieceOk,
} from './pieces-styles/playok-pieces';
import {
  BlackKingPiecexahlee,
  RedKingPiecexahlee,
} from './pieces-styles/xahlee-pieces';
import {
  BlackKingPieceXboard,
  RedKingPieceXboard,
} from './pieces-styles/xboard-pieces';
import { CircleCheck } from 'lucide-react';
import { ThemeNames } from '@/stores/setting-store';

const radioOptions = [
  {
    value: 'chinese',
    content: (
      <div className="flex items-center justify-center scale-[1] origin-center">
        <div>
          <IconKingRed />
        </div>
        <div>
          <IconKingBlack />
        </div>
      </div>
    ),
  },
  {
    value: 'club',
    content: (
      <div className="flex items-center justify-center scale-[1] origin-center ">
        <div>
          <RedKingPiece />
        </div>
        <div>
          <BlackKingPiece />
        </div>
      </div>
    ),
  },
  {
    value: 'playok',
    content: (
      <div className=" flex items-center justify-center scale-[1.25] origin-center">
        <div>
          <RedKingPieceOk />
        </div>
        <div>
          <BlackKingPieceOk />
        </div>
      </div>
    ),
  },
  {
    value: 'xahlee',
    content: (
      <div className="flex items-center justify-center scale-[1] origin-center ">
        <div>
          <RedKingPiecexahlee />
        </div>
        <div>
          <BlackKingPiecexahlee />
        </div>
      </div>
    ),
  },
  {
    value: 'xboard',
    content: (
      <div className="flex items-center justify-center overflow-hidden">
        <div className="w-13 h-13">
          <RedKingPieceXboard />
        </div>
        <div className="w-13 h-13">
          <BlackKingPieceXboard />
        </div>
      </div>
    ),
  },
];


export function PieceStyleSelector({ pieceTheme }: { pieceTheme: (theme: ThemeNames) => void }) {
  return (
    <RadioGroup.Root
      className="flex items-center flex-col gap-3"
      onValueChange={(value) => pieceTheme(value as ThemeNames)}
    >
      {radioOptions.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            'relative group ring-[1px] ring-border rounded p-4',
            'data-[state=checked]:ring-2 data-[state=checked]:ring-gray-500',
            'flex items-center justify-center',
          )}
        >
          <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-5 w-5 text-primary fill-gray-500 stroke-white group-data-[state=unchecked]:hidden" />
          <div className="flex justify-center items-center w-25 h-13">{option.content}</div>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
