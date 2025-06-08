import { Button } from '../ui/button';
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

export default function ChoosePieceSetting() {
  return (
    <div className="flex flex-wrap gap-2">
      {/* chinese */}
      <Button
        className="flex items-center justify-center p-6"
        variant="outline"
      >
        <div className="scale-[2] origin-center flex">
          <IconKingRed />
          <IconKingBlack />
        </div>
      </Button>
      {/* club */}
      <Button
        className="flex items-center justify-center px-0 py-6"
        variant="outline"
      >
        <div className="scale-[0.75] origin-center flex">
          <RedKingPiece />
          <BlackKingPiece />
        </div>
      </Button>
      {/* playok */}
      <Button
        className="flex items-center justify-center px-1 py-6"
        variant="outline"
      >
        <div className="scale-[1] origin-center flex">
          <RedKingPieceOk />
          <BlackKingPieceOk />
        </div>
      </Button>
      {/* xahlee */}
      <Button
        className="flex items-center justify-center px-0 py-6"
        variant="outline"
      >
        <div className="scale-[0.75] origin-center flex">
          <RedKingPiecexahlee />
          <BlackKingPiecexahlee />
        </div>
      </Button>
      {/* xboard */}
      <Button
        className="flex items-center justify-center px-1 py-6"
        variant="outline"
      >
        <div className="w-auto h-auto flex items-center justify-center overflow-hidden">
          <div className="w-10 h-10">
            <RedKingPieceXboard />
          </div>
          <div className="w-10 h-10">
            <BlackKingPieceXboard />
          </div>
        </div>
      </Button>
    </div>
  );
}

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

export const PieceStyleSelector = () => {
  return (
    <RadioGroup.Root defaultValue="chinese" className="flex items-center flex-col gap-3">
      {radioOptions.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            'relative group ring-[1px] ring-border rounded p-4',
            'data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500',
            'flex items-center justify-center',
          )}
        >
          <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-5 w-5 text-primary fill-blue-500 stroke-white group-data-[state=unchecked]:hidden" />
          <div className="flex justify-center items-center w-25 h-13">{option.content}</div>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};
