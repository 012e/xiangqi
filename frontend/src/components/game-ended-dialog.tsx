import { useGameStore } from '@/stores/online-game-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';

const detailReasons = [
  {
    result: 'black_resign',
    description: 'Black resigned.',
  },
  {
    result: 'black_timeout',
    description: 'Black ran out of time.',
  },
  {
    result: 'black_checkmate',
    description: 'Black was checkmated.',
  },
  {
    result: 'white_resign',
    description: 'Red resigned.',
  },
  {
    result: 'white_timeout',
    description: 'Red ran out of time.',
  },
  {
    result: 'white_checkmate',
    description: 'Red was checkmated.',
  },
  {
    result: 'stalemate',
    description: 'Stalemate (no legal move, not in check).',
  },
  {
    result: 'insufficient_material',
    description: 'Not enough material to checkmate.',
  },
  {
    result: 'fifty_move_rule',
    description: 'Draw by 50-move rule.',
  },
  {
    result: 'mutual_agreement',
    description: 'Draw by agreement.',
  },
];

export default function GameEndedDialog() {
  const showGameEndedDialog = useGameStore(state => state.showGameEndedDialog);
  const gameResult = useGameStore(state => state.gameResult);
  const gameResultDetail = useGameStore(state => state.gameResultDetail);
  const navigate = useNavigate()
  const { setGameEndedDialog } = useGameStore(state => state.actions);

  return <Dialog open={showGameEndedDialog} onOpenChange={setGameEndedDialog}>
    <DialogContent className="h-auto w-80 p-0 rounded-lg border-none shadow-lg">
      <DialogHeader>
        <DialogTitle
          className="flex justify-center font-bold tracking-tight text-3xl bg-sidebar-border border-none rounded-t-lg p-3 text-destructive">Game
          Over</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2 items-center h-full">
        <div className="text-2xl font-bold text-chart-2">
          {
            gameResult === 'white_win' ? 'Red Won' :
              gameResult === 'black_win' ? 'Black Won' :
                'A Tied Game'}
        </div>
        <div className="text-lg text-ring">
          {
            detailReasons.find((r) => r.result === gameResultDetail)?.description
            || 'Not found in detail reasons. Please contact Huy if you see this message.'
          }
        </div>
      </div>
      <div className="grid grid-rows-2 gap-2 mt-4 mx-10">
        <div className="flex justify-center h-full">
          <Button className="w-full font-bold text-2xl h-full tracking-tight">Game review</Button>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Button className="text-ring bg-accent border tracking-tight hover:opacity-80" onClick={() => navigate('/play/online')}>Play again</Button>
          <Button className="text-ring bg-accent border tracking-tight hover:opacity-80" onClick={() => navigate('play/online')}>Rematch</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
