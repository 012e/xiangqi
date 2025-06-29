import { useStompClient, useSubscription } from 'react-stomp-hooks';
import {
  Player,
  useGameActions,
  useGameStore,
} from '@/stores/online-game-store';
import { deserializeState } from './state';
import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appAxios } from '@/services/AxiosClient.ts';
import { GameResponse } from '@/lib/online/game-response.ts';

function getOurPlayer(data: GameResponse, ourUserId: string): Player {
  if (data.whitePlayer?.sub === ourUserId) {
    return {
      ...data.whitePlayer,
      elo: data.whiteElo,
      eloChange: data.whiteEloChange,
      color: 'white',
      time: data.whiteTimeLeft,
      isOfferingDraw: data.whiteOfferingDraw ?? false,
    };
  } else {
    return {
      ...data.blackPlayer,
      elo: data.blackElo,
      eloChange: data.blackEloChange,
      color: 'black',
      time: data.blackTimeLeft,
      isOfferingDraw: data.blackOfferingDraw ?? false,
    };
  }
}

function getEnemyPlayer(data: GameResponse, ourUserId: string): Player {
  if (data.whitePlayer?.sub !== ourUserId) {
    return {
      ...data.whitePlayer,
      elo: data.whiteElo,
      eloChange: data.whiteEloChange,
      color: 'white',
      time: data.whiteTimeLeft,
      isOfferingDraw: data.whiteOfferingDraw ?? false,
    };
  } else {
    return {
      ...data.blackPlayer,
      elo: data.blackElo,
      eloChange: data.blackEloChange,
      color: 'black',
      time: data.blackTimeLeft,
      isOfferingDraw: data.blackOfferingDraw ?? false,
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
  const { move, handleTopicMessage, reset } = useGameStore(
    (state) => state.actions,
  );

  const {
    data,
    isLoading: gameStateLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const response = await appAxios.get<GameResponse>(`/game/${gameId}`);
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!gameId,
  });

  const isLoading = useMemo(() => {
    return gameStateLoading || !stompClient;
  }, [gameStateLoading, stompClient]);

  if (isError) console.log(error);

  useEffect(() => {
    if (!data) {
      reset();
      return;
    }

    if (initialData.current) {
      return;
    }
    initialData.current = data as GameResponse;

    const ourPlayer: Player = getOurPlayer(data, user?.sub ?? '');
    const enemyPlayer: Player = getEnemyPlayer(data, user?.sub ?? '');

    const playingColor = data.uciFen?.includes('w') ? 'white' : 'black';
    init({
      gameId: gameId,
      isStarted: false,
      playingColor: playingColor,
      selfPlayer: ourPlayer,
      enemyPlayer: enemyPlayer,
      initialFen: data.uciFen,

      isEnded: !!data.result,
    });
  }, [data, initialData, gameId, init, user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onMove = useCallback(
    function (from: string, to: string, _piece: string): boolean {
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
    },
    [gameId, move, stompClient],
  );

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

  const resign = useCallback(async () => {
    appAxios.post(`/game/${gameId}/resign`);
  }, [gameId]);

  const offerDraw = useCallback(async () => {
    appAxios.post(`/game/${gameId}/offer-draw`);
  }, [gameId]);

  const declineDraw = useCallback(async () => {
    appAxios.post(`/game/${gameId}/decline-draw`);
  }, [gameId]);

  return {
    game: gameState,
    fen: useGameStore((state) => state.fen),
    onMove,
    playingColor,
    isLoading,
    resign,
    declineDraw,
    offerDraw,
    isPlayWithBot: data?.isGameWithBot ?? false,
  };
}
