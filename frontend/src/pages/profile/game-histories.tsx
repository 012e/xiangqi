import { useQuery } from '@tanstack/react-query';
import { getGamesByUserId } from '@/lib/profile/profile-games.ts';
import { Crosshair, Loader2, Swords } from 'lucide-react';
import { GameResponse } from '@/lib/online/game-response';
import AppBoard from '@/components/app-board.tsx';
import { cn } from '@/lib/utils.ts';
import { appAxios } from '@/services/AxiosClient.ts';
import { useNavigate } from 'react-router';
import { addFriend } from '@/lib/friend/useFriendRequestActions.ts';
import PlayerCard from '@/components/play/my-hover-card.tsx';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card.tsx';
import React, { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

async function getGameTypeById(gameId: number) {
  const response = await appAxios.get(`/game-types/${gameId}`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error("Can't get game type");
}

export function GameHistory({
  game,
  index,
}: {
  game: GameResponse;
  index: number;
}) {
  const { data: gameType, isLoading } = useQuery({
    queryFn: () => getGameTypeById(game.gameTypeId),
    queryKey: ['gameType', game.gameTypeId],
  });
  const navigate = useNavigate();

  const convertToPlayerCardFormat = (
    player: GameResponse['whitePlayer'],
    elo: number,
    eloChange?: number,
    color: 'white' | 'black' = 'white',
  ) => {
    if (!player) return null;
    return {
      id: player.id,
      username: player.username,
      color: color,
      picture: player.picture,
      time: game[`${color}TimeLeft`],
      name: player.name,
      sub: player.sub,
      email: player.email,
      elo: elo,
      eloChange: eloChange,
    };
  };

  const whitePlayerForCard = useMemo(() => {
    return convertToPlayerCardFormat(
      game.whitePlayer,
      game.whiteElo,
      game.whiteEloChange,
      'white',
    );
  }, [game]);

  const blackPlayerForCard = useMemo(() => {
    return convertToPlayerCardFormat(
      game.blackPlayer,
      game.blackElo,
      game.blackEloChange,
      'black',
    );
  }, [game]);

  if (isLoading) {
    return <div>Loading</div>;
  }
  return (
    <div
      className={cn(
        'p-5 flex gap-5 hover:opacity-80 hover:cursor-pointer',
        index % 2 !== 0 ? 'bg-card' : 'bg-muted',
      )}
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <AppBoard
        boardWidth={200}
        position={game.uciFen}
        isDraggablePiece={() => false}
      />
      <div className="flex flex-col justify-between w-full">
        <div className="flex items-start">
          <div className="flex gap-2 items-center">
            <span>
              <Crosshair className="w-7 h-auto"></Crosshair>
            </span>
            <p className="text-2xl font-semibold">{gameType.typeName}</p>
          </div>
        </div>
        <div className="flex flex-row gap-5 justify-center items-center w-full h-full">
          <div className="flex flex-col gap-1 justify-center items-center">
            {whitePlayerForCard ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <p className="text-xl font-semibold cursor-pointer hover:text-primary">
                    {game.whitePlayer.username}
                  </p>
                </HoverCardTrigger>
                <HoverCardContent className="w-auto">
                  <PlayerCard
                    player={whitePlayerForCard}
                    onAddFriend={addFriend}
                    isCurrentPlayer={false}
                  />
                </HoverCardContent>
              </HoverCard>
            ) : (
              <p className="text-xl font-semibold">
                {game.whitePlayer.username}
              </p>
            )}
            <p className="text-lg">
              <span>{game.whiteElo + ' '}</span>
              {game.whiteEloChange && (
                <span
                  className={cn(
                    'text-chart-2',
                    game.whiteEloChange < 0 ? 'text-chart-5' : 'text-chart-2',
                  )}
                >
                  {game.whiteEloChange < 0
                    ? game.whiteEloChange
                    : '+' + (game.whiteEloChange ? game.whiteEloChange : '0')}
                </span>
              )}
            </p>
          </div>
          <span>
            <Swords className="w-10 h-auto" />
          </span>
          <div className="flex flex-col gap-1 justify-center items-center">
            {blackPlayerForCard ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <p className="text-xl font-semibold cursor-pointer hover:text-primary">
                    {game.blackPlayer.username}
                  </p>
                </HoverCardTrigger>
                <HoverCardContent className="w-auto">
                  <PlayerCard
                    player={blackPlayerForCard}
                    onAddFriend={addFriend}
                    isCurrentPlayer={false}
                  />
                </HoverCardContent>
              </HoverCard>
            ) : (
              <p className="text-xl font-semibold">
                {game.blackPlayer.username}
              </p>
            )}
            <p className="text-lg">
              <span>{game.blackElo + ' '}</span>
              {game.blackEloChange && (
                <span
                  className={cn(
                    'text-chart-2',
                    game.blackEloChange < 0 ? 'text-chart-5' : 'text-chart-2',
                  )}
                >
                  {game.blackEloChange < 0
                    ? game.blackEloChange
                    : '+' + (game.blackEloChange ? game.blackEloChange : '0')}
                </span>
              )}
            </p>
          </div>
        </div>

        <div>
          <p></p>
        </div>
      </div>
    </div>
  );
}

export function GameHistories({ userId }: { userId: number }) {
  const {
    data: games,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['gamesOfUser', userId],
    queryFn: () => getGamesByUserId(userId),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: games?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 290,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader2 className="animate-spin size-10"></Loader2>
      </div>
    );
  }

  if (isError) return <div>Error</div>;

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="flex overflow-auto flex-col w-full"
      style={{ height: '600px' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualRow) => {
          const game = games![virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <GameHistory game={game} index={virtualRow.index} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

