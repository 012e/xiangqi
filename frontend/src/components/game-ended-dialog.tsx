import { useGameStore } from "@/stores/online-game-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export default function GameEndedDialog() {
  const showGameEndedDialog = useGameStore(state => state.showGameEndedDialog);
  const gameResult = useGameStore(state => state.gameResult);
  const gameResultDetail = useGameStore(state => state.gameResultDetail);
  const { setGameEndedDialog } = useGameStore(state => state.actions);

  return <Dialog open={showGameEndedDialog} onOpenChange={setGameEndedDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Game Over</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        <div className="text-lg font-bold">Result: {gameResult}</div>
        <div className="text-sm text-gray-500">Detail: {gameResultDetail}</div>
      </div>
    </DialogContent>
  </Dialog>
}
