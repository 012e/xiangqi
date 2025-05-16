import { useGameStore } from '@/stores/online-game-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

export default function GameEndedDialog() {
  const showGameEndedDialog = useGameStore(state => state.showGameEndedDialog);
  const gameResult = useGameStore(state => state.gameResult);
  const gameResultDetail = useGameStore(state => state.gameResultDetail);
  const { setGameEndedDialog } = useGameStore(state => state.actions);

  return <Dialog open={showGameEndedDialog} onOpenChange={setGameEndedDialog}>
    <DialogContent className="h-auto w-80 border">
      <DialogHeader>
        <DialogTitle className="flex justify-center font-bold tracking-tight text-3xl">Game Over</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-bold">Winner: {gameResult === 'white_win' ? 'Red' : 'Black'}</div>
        <div className="text-sm text-gray-500">Reason: {gameResultDetail}</div>
      </div>
      <div className="grid grid-rows-2 gap-2 mt-4">
        <div className="flex justify-center h-full">
          <Button className="w-full font-bold text-2xl h-full tracking-tight">Game review</Button>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Button className="text-ring bg-accent border tracking-tight hover:opacity-80">Play again</Button>
          <Button className="text-ring bg-accent border tracking-tight hover:opacity-80">Rematch</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
