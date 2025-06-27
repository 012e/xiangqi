import { cn } from '@/lib/utils';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { CircleCheck } from 'lucide-react';
import { XiangqiBoard } from '@/components/chessboard-styles/board-styles/xiangqi-board.tsx';
import { BoardXboard1, BoardXboard2 } from '@/components/chessboard-styles/board-styles/xboard-board.tsx';
import { Board01xq } from '@/components/chessboard-styles/board-styles/01xq-board.tsx';
import useSettingStore from '@/stores/setting-store.ts';

const radioOptions = [
  {
    value: XiangqiBoard,
    content: (
      <div className="flex items-center justify-center scale-[1] origin-center">
        <img src={'/public/images/default.png'} alt='nope'></img>
      </div>
    ),
  },
  {
    value: BoardXboard1,
    content: (
      <div className="flex items-center justify-center scale-[1] origin-center ">
        <img src={'/public/images/xboard1.png'} alt='nope'></img>
      </div>
    ),
  },
  {
    value: BoardXboard2,
    content: (
      <div className=" flex items-center justify-center scale-[1] origin-center">
        <img src={'/public/images/xboard2.png'} alt='nope'></img>
      </div>
    ),
  },
  {
    value: Board01xq,
    content: (
      <div className="flex items-center justify-center scale-[1] origin-center ">
        <img src={'/public/images/01xq.png'} alt='nope'></img>
      </div>
    ),
  },
];

export function BoardStyleSelector({ boardTheme }: { boardTheme: (theme: string) => void }) {
  const currentBoard = useSettingStore(state => state.boardTheme);
  return (
    <RadioGroup.Root
      value={currentBoard}
      className="flex items-center flex-col justify-center gap-3 p-3"
      onValueChange={(value) => boardTheme(value as string)}
    >
      {radioOptions.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            'relative group ring-[1px] ring-border rounded p-1',
            'data-[state=checked]:ring-2 data-[state=checked]:ring-gray-500',
            'flex items-center justify-center',
          )}
        >
          <div className="flex justify-center items-center w-18 h-18">{option.content}</div>
          <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-5 w-5 text-primary fill-gray-500 stroke-white group-data-[state=unchecked]:hidden" />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
