import { useMemo, useRef, useEffect, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Crosshair, Loader2, Swords } from 'lucide-react';

import { getGamesByUserId } from '@/lib/profile/profile-games.ts';
import { GameResponse } from '@/lib/online/game-response';
import { appAxios } from '@/services/AxiosClient.ts';
import { addFriend } from '@/lib/friend/useFriendRequestActions.ts';
import { cn } from '@/lib/utils.ts';

import AppBoard from '@/components/app-board.tsx';
import PlayerCard from '@/components/play/my-hover-card.tsx';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card.tsx';

interface GameType {
  id: number;
  typeName: string;
}

async function getGameTypeById(gameId: number): Promise<GameType> {
  const response = await appAxios.get(`/game-types/${gameId}`);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error("Can't get game type");
}

function GameHistory({
  game,
  gameType,
  index,
}: {
  game: GameResponse;
  gameType: GameType | undefined;
  index: number;
}) {
  const navigate = useNavigate();

  const whitePlayerForCard = useMemo(() => {
    if (!game.whitePlayer) return null;
    return {
      id: game.whitePlayer.id,
      username: game.whitePlayer.username,
      color: 'white' as const,
      picture: game.whitePlayer.picture,
      time: game.whiteTimeLeft,
      name: game.whitePlayer.name,
      sub: game.whitePlayer.sub,
      email: game.whitePlayer.email,
      elo: game.whiteElo,
      eloChange: game.whiteEloChange,
    };
  }, [game]);

  const blackPlayerForCard = useMemo(() => {
    if (!game.blackPlayer) return null;
    return {
      id: game.blackPlayer.id,
      username: game.blackPlayer.username,
      color: 'black' as const,
      picture: game.blackPlayer.picture,
      time: game.blackTimeLeft,
      name: game.blackPlayer.name,
      sub: game.blackPlayer.sub,
      email: game.blackPlayer.email,
      elo: game.blackElo,
      eloChange: game.blackEloChange,
    };
  }, [game]);

  return (
    <div
      className={cn(
        'p-5 flex gap-5 hover:opacity-80 hover:cursor-pointer',
        index % 2 !== 0 ? 'bg-card' : 'bg-muted',
      )}
      onClick={() => navigate(`/game/${game.id}`)}
    >
      <div style={{ width: '225px', height: '250px' }}>
        <AppBoard
          boardWidth={200}
          position={game.uciFen}
          isDraggablePiece={() => false}
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <div className="flex items-start">
          <div className="flex gap-2 items-center">
            <span>
              <Crosshair className="w-7 h-auto" />
            </span>
            <p className="text-2xl font-semibold">
              {gameType?.typeName ?? 'Unknown Mode'}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-5 justify-center items-center w-full h-full">
          <div className="flex flex-col gap-1 justify-center items-center">
            {whitePlayerForCard ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <p
                    className="text-xl font-semibold cursor-pointer hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/profile/${game.whitePlayer.id}`);
                    }}
                  >
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
              {game.whiteEloChange != null && (
                <span
                  className={cn(
                    game.whiteEloChange < 0 ? 'text-chart-5' : 'text-chart-2',
                  )}
                >
                  {game.whiteEloChange > 0 ? '+' : ''}
                  {game.whiteEloChange}
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
                  <p
                    className="text-xl font-semibold cursor-pointer hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/profile/${game.blackPlayer.id}`);
                    }}
                  >
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
              {game.blackEloChange != null && (
                <span
                  className={cn(
                    game.blackEloChange < 0 ? 'text-chart-5' : 'text-chart-2',
                  )}
                >
                  {game.blackEloChange > 0 ? '+' : ''}
                  {game.blackEloChange}
                </span>
              )}
            </p>
          </div>
        </div>
        {game.uciFen.includes("|") && (
          <div>
            <p className="font-semibold">Moves</p>
            <div>
              <MoveHistory uciFen={game.uciFen} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function MoveHistory({ uciFen }: { uciFen: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const [displayMoves, setDisplayMoves] = useState<string[]>([]);
  const [totalMoves, setTotalMoves] = useState(0);

  useEffect(() => {
    const parts = uciFen.split('|');
    const moveHistoryString = parts.length > 1 ? parts[1].trim() : '';
    if (!moveHistoryString) return;

    const allMoves = moveHistoryString.split(/\s+/).filter(Boolean);
    const totalMoveCount = allMoves.length;
    setTotalMoves(totalMoveCount);

    if (!containerRef.current || !measureRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    let visibleMoves: string[] = [];

    for (let i = 0; i < totalMoveCount; i++) {
      const moveNumber = Math.floor(i / 2) + 1;
      const moveText =
        i % 2 === 0 ? `${moveNumber}. ${allMoves[i]}` : allMoves[i];

      const potentialMoves = [...visibleMoves, moveText];
      const suffix = ` ... moves ${totalMoveCount}`;

      measureRef.current.textContent = potentialMoves.join(' ') + suffix;

      if (measureRef.current.offsetWidth > containerWidth) {
        break;
      }

      visibleMoves = potentialMoves;
    }

    setDisplayMoves(visibleMoves);
  }, [uciFen]);

  const showSuffix = displayMoves.length < totalMoves;

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full text-ellipsis">
        <span>{displayMoves.join(' ')}</span>
        {showSuffix && (
          <span className="ml-1 font-semibold">{`... moves ${totalMoves}`}</span>
        )}
      </div>
      <span
        ref={measureRef}
        className="absolute invisible top-[-9999px] left-[-9999px]"
      />
    </div>
  );
}
export function GameHistories({ userId }: { userId: number }) {
  const {
    data: games,
    isLoading: isLoadingGames,
    isError,
  } = useQuery({
    queryKey: ['gamesOfUser', userId],
    queryFn: () => getGamesByUserId(userId),
    staleTime: 5 * 60 * 1000,
  });

  const uniqueGameTypeIds = useMemo(() => {
    if (!games) return [];
    return [...new Set(games.map((game) => game.gameTypeId))];
  }, [games]);

  const gameTypeQueries = useQueries({
    queries: uniqueGameTypeIds.map((id) => ({
      queryKey: ['gameType', id],
      queryFn: () => getGameTypeById(id),
      staleTime: 0,
    })),
  });

  const gameTypesMap = useMemo(() => {
    const map = new Map<number, GameType>();
    gameTypeQueries.forEach((query) => {
      if (query.data) {
        map.set(query.data.id, query.data);
      }
    });
    return map;
  }, [gameTypeQueries]);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: games?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 290,
  });

  const isLoading =
    isLoadingGames || gameTypeQueries.some((query) => query.isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader2 className="animate-spin size-10" />
      </div>
    );
  }

  if (isError) return <div>Error loading game history.</div>;
  if (!games || games.length === 0) return <div>No games played yet.</div>;

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="overflow-auto w-full"
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
          const game = games[virtualRow.index];
          const gameType = gameTypesMap.get(game.gameTypeId);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <GameHistory
                game={game}
                gameType={gameType}
                index={virtualRow.index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
