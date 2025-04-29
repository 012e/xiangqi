// NewGame.tsx
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateGame } from '../../stores/useCreateGame';

export default function NewGame({ className }: { className?: string }) {
  const { createGame, loading, user } = useCreateGame();

  if (!user) {
    return <div>Not logged in yet</div>;
  }

  if (loading) {
    return (
      <Button disabled className={className}>
        <div className="flex justify-center items-center h-16">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Button>
    );
  }

  return (
    <Button onClick={createGame} className={className}>
      Create game
    </Button>
  );
}
