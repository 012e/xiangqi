import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { Player, useGameActions, useGameStore } from '@/stores/online-game-store';
import { deserializeState } from './state';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appAxios } from '@/services/AxiosClient.ts';
import { GameResponse } from '@/lib/online/game-response.ts';

function getOurPlayer(data: GameResponse, ourUserId: string): Player {
  if (data.whitePlayer?.sub === ourUserId) {
    return {
      ...data.whitePlayer,
      color: 'white',
      time: data.whiteTimeLeft,
    };
  } else {
    return {
      ...data.blackPlayer,
      color: 'black',
      time: data.blackTimeLeft,
    };
  }
}

function getEnemyPlayer(data: GameResponse, ourUserId: string): Player {
  if (data.whitePlayer?.sub !== ourUserId) {
    return {
      ...data.whitePlayer,
      color: 'white',
      time: data.whiteTimeLeft,
    };
  } else {
    return {
      ...data.blackPlayer,
      color: 'black',
      time: data.blackTimeLeft,
    };
  }
}

export function useOnlineGame(gameId: string | undefined) {
  if (!gameId) {
    throw new Error('Game ID is required');
  }
  const stompClient = useStompClient();
  const { user } = useAuth0();

  const initialData = useRef<GameResponse>(null);


  const { init } = useGameActions();

  // Access store actions and state
  const gameState = useGameStore((state) => state.gameState);
  const playingColor = useGameStore((state) => state.playingColor);
  const { move, handleTopicMessage } = useGameStore((state) => state.actions);

  const {
    data,
    isLoading: gameStateLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['gameId', gameId],
    queryFn: async () => {
      const response = await appAxios.get<GameResponse>(`/game/${gameId}`);
      return response.data;
    },
    enabled: !!gameId,
  });

  const isLoading = useMemo(() => {
    return gameStateLoading || !stompClient;
  }, [gameStateLoading, stompClient]);

  if (isError) console.log(error);

  useEffect(() => {
    if (initialData.current || !data) {
      return;
    }
    initialData.current = data as GameResponse;

    const fen = data.uciFen?.substring(0, data.uciFen?.indexOf('|')).trim();
    
    const ourPlayer: Player = getOurPlayer(data, user?.sub ?? '');
    const enemyPlayer: Player = getEnemyPlayer(data, user?.sub ?? '');
    
    const playingColor = data.uciFen?.includes('w') ? 'white' : 'black';
    init({
      gameId: gameId,
      isStarted: false,
      playingColor: playingColor,
      selfPlayer: ourPlayer,
      enemyPlayer: enemyPlayer,
      initialFen: data.uciFen, // Pass the full UCI FEN with history

      isEnded: !!data.result,
    });
  }, [data, initialData, gameId, init, user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onMove(from: string, to: string, _piece: string): boolean {
    if (!stompClient) {
      console.log('No stomp client');
      return false;
    }

    if (move({ from, to })) {
      // Send move to server
      stompClient.publish({
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
        destination: `/app/game/${gameId}`,
        body: JSON.stringify({ from, to }),
      });
    }

    return true;
  }

  // Subscribe to game state updates
  useSubscription(
    `/topic/game/${gameId}`,
    (message) => {
      const gameData = deserializeState(JSON.parse(message.body));
      handleTopicMessage(gameData);
    },
    {
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    },
  );
  console.log("data",data);
  return {
    game: gameState,
    fen: useGameStore((state) => state.fen),
    onMove,
    playingColor,
    isLoading,
    isPlayWithBot: data?.isGameWithBot ?? false,
  };
}
