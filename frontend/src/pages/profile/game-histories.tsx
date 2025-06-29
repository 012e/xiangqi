import { useQuery } from '@tanstack/react-query';
import { getGamesByUserId } from '@/lib/profile/profile-games.ts';
import { Loader2 } from 'lucide-react';
import { GameResponse } from '@/lib/online/game-response';
import AppBoard from '@/components/app-board.tsx';

export function GameHistory({ game }: { game: GameResponse }) {
  return <div>
    <div className="rounded-4xl">
      <AppBoard boardWidth={250} position={game.uciFen} />
    </div>
  </div>;
}

export function GameHistories({ userId }: { userId: number }) {
  const { data: games, isLoading, isError } = useQuery({
    queryKey: ['gamesOfUser', userId],
    queryFn: () => getGamesByUserId(userId),
  });
  if (isLoading) {
    return (<div className="flex justify-center items-center w-full h-full">
        <Loader2 className="size-10 animate-spin"></Loader2>
      </div>
    );
  }

  if (isError) return (
    <div>Error</div>
  )

  return (
    <div className="flex flex-col gap-5 w-full">
      {
        games!.map(game => <GameHistory game={game} />)
      }
    </div>
  );
}