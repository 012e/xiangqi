import { cn } from '@/lib/utils';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { CircleCheck } from 'lucide-react';
import { XiangqiBoard } from '@/components/chessboard-styles/board-styles/xiangqi-board.tsx';
import { BoardXboard1, BoardXboard2 } from '@/components/chessboard-styles/board-styles/xboard-board.tsx';
import { Board01xq } from '@/components/chessboard-styles/board-styles/01xq-board.tsx';

const radioOptions = [
  {
    value: XiangqiBoard,
    content: (
      <div className="flex items-center justify-center scale-[1] origin-center">
        default
      </div>
    ),
  },
  {
    value: BoardXboard1,
    content: (
      <div className="flex items-center justify-center scale-[1] origin-center ">
        xboard1
      </div>
    ),
  },
  {
    value: BoardXboard2,
    content: (
      <div className=" flex items-center justify-center scale-[1.25] origin-center">
        xboard2
      </div>
    ),
  },
  {
    value: Board01xq,
    content: (
      <div className="flex items-center justify-center scale-[1] origin-center ">
        01xq
      </div>
    ),
  },
];


export function BoardStyleSelector({ boardTheme }: { boardTheme: (theme: string) => void }) {
  return (
    <RadioGroup.Root
      className="flex items-center flex-col gap-3"
      onValueChange={(value) => boardTheme(value as string)}
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
