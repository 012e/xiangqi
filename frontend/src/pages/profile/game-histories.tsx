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
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card.tsx';

async function getGameTypeById(gameId: number) {
  const response = await appAxios.get(`/game-types/${gameId}`);

  if (response.status === 200) {
    return response.data;
  }

  throw new Error('Can\'t get game type');
}

export function GameHistory({ game, index }: { game: GameResponse, index: number }) {
  const { data: gameType, isLoading } = useQuery({
    queryFn: () => getGameTypeById(game.gameTypeId),
    queryKey: ['gameType', game.gameTypeId],
  });
  const navigate = useNavigate();

  // Convert GameResponse Player to PlayerCard Player format
  const convertToPlayerCardFormat = (player: GameResponse['whitePlayer'], elo: number, eloChange?: number, color: 'white' | 'black' = 'white') => {
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

  const whitePlayerForCard = convertToPlayerCardFormat(game.whitePlayer, game.whiteElo, game.whiteEloChange, 'white');
  const blackPlayerForCard = convertToPlayerCardFormat(game.blackPlayer, game.blackElo, game.blackEloChange, 'black');

  if (isLoading) {
    return (
      <div>Loading</div>
    );
  }
  return <div className={cn('p-5 flex gap-5 hover:opacity-80 hover:cursor-pointer', (index % 2 !== 0) ? 'bg-card' : 'bg-muted')} onClick={() => navigate(`/game/${game.id}`)}>
    <div>
      <AppBoard boardWidth={250} position={game.uciFen} isDraggablePiece={() => false} />
    </div>
    <div className="flex flex-col justify-between w-full">
      <div className="flex items-start">
        <div className="flex gap-2 items-center">
        <span>
          <Crosshair className="w-7 h-auto"></Crosshair>
        </span>
          <p className="font-semibold text-2xl">{gameType.typeName}</p>
        </div>
      </div>
      <div className="flex flex-row gap-5 items-center justify-center h-full w-full">
        <div className="justify-center flex flex-col gap-1 items-center">
          {whitePlayerForCard ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <p 
                  className="font-semibold text-xl cursor-pointer hover:text-primary" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the game navigation
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
            <p 
              className="font-semibold text-xl cursor-pointer hover:text-primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the game navigation
                navigate(`/user/profile/${game.whitePlayer.id}`);
              }}
            >
              {game.whitePlayer.username}
            </p>
          )}
          <p className="text-lg ">
            <span>
              {
                game.whiteElo + " "
              }
            </span>
            {
              game.whiteEloChange && (
                <span className={cn('text-chart-2', game.whiteEloChange < 0 ? 'text-chart-5' : 'text-chart-2')}>
                    { game.whiteEloChange < 0 ? game.whiteEloChange : "+" + (game.whiteEloChange ? game.whiteEloChange : "0") }
                </span>
              )
            }
          </p>
        </div>
        <span>
        <Swords className="w-10 h-auto" />
      </span>
        <div className="justify-center flex flex-col gap-1 items-center">
          {blackPlayerForCard ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <p 
                  className="font-semibold text-xl cursor-pointer hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the game navigation
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
            <p 
              className="font-semibold text-xl cursor-pointer hover:text-primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the game navigation
                navigate(`/user/profile/${game.blackPlayer.id}`);
              }}
            >
              {game.blackPlayer.username}
            </p>
          )}
          <p className="text-lg">
            <span>
              {
                game.blackElo + " "
              }
            </span>
            {
              game.blackEloChange && (
                <span className={cn('text-chart-2', game.blackEloChange < 0 ? 'text-chart-5' : 'text-chart-2')}>
                    { game.blackEloChange < 0 ? game.blackEloChange : "+" + (game.blackEloChange ? game.blackEloChange : "0") }
                </span>
              )
            }
          </p>

        </div>
      </div>

      <div>
        <p></p>
      </div>
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
  );

  return (
    <div className="flex flex-col w-full">
      {
        games!.map((game, index) => <GameHistory game={game} key={game.id} index={index} />)
      }
    </div>
  );
}