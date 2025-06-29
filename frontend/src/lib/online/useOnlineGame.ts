import { useStompClient, useSubscription } from 'react-stomp-hooks';
import {
  Player,
  useGameActions,
  useGameStore,
} from '@/stores/online-game-store';
import { deserializeState } from './state';
import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appAxios } from '@/services/AxiosClient.ts';
import { GameResponse } from '@/lib/online/game-response.ts';

/**
 * Helper function to extract our player's data from the game response.
 */
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

/**
 * Helper function to extract the opponent's data from the game response.
 */
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

/**
 * Custom hook to manage the state and interactions of an online game.
 *
 * @param gameId The ID of the game to connect to.
 */
export function useOnlineGame(gameId: string | undefined) {
  if (!gameId) {
    throw new Error('useOnlineGame hook requires a valid gameId');
  }

  const stompClient = useStompClient();
  const { user } = useAuth0();

  // Access Zustand store actions and state
  const { init, move, handleTopicMessage, reset } = useGameStore(
    (state) => state.actions,
  );
  const gameState = useGameStore((state) => state.gameState);
  const fen = useGameStore((state) => state.fen);
  const playingColor = useGameStore((state) => state.playingColor);

  // Fetch the initial game state from the server
  const {
    data,
    isLoading: isQueryLoading,
    error,
    isError,
    isSuccess, // Use isSuccess to reliably know when data is available
  } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const response = await appAxios.get<GameResponse>(`/game/${gameId}`);
      return response.data;
    },
    // staleTime: 0 ensures data is considered stale immediately, prompting a background refetch on mount.
    staleTime: 0,
    // gcTime: 0 (or cacheTime in v4) ensures data is removed from cache when no longer used.
    gcTime: 0,
    // The query will only run if a gameId is provided.
    enabled: !!gameId,
  });

  // Combine query loading state with STOMP client connection status
  const isLoading = useMemo(() => {
    return isQueryLoading || !stompClient;
  }, [isQueryLoading, stompClient]);

  // Log any errors from the query
  if (isError) {
    console.error('Failed to fetch game data:', error);
  }

  // This effect handles the initialization and cleanup of the game state.
  useEffect(() => {
    // Only initialize the state if the query was successful and we have data.
    if (isSuccess && data) {
      const ourPlayer = getOurPlayer(data, user?.sub ?? '');
      const enemyPlayer = getEnemyPlayer(data, user?.sub ?? '');
      const currentPlayingColor = data.uciFen?.includes('w')
        ? 'white'
        : 'black';

      init({
        gameId: gameId,
        playingColor: currentPlayingColor,
        selfPlayer: ourPlayer,
        enemyPlayer: enemyPlayer,
        initialFen: data.uciFen,
        isEnded: !!data.result,
        isStarted: data.isStarted,
      });
    }

    return () => {
      reset(); // Resets the Zustand store to its initial, clean state.
    };
  }, [data, isSuccess, gameId, init, reset, user?.sub]);

  // Callback for when a player makes a move on the board.
  const onMove = useCallback(
    function (from: string, to: string): boolean {
      if (!stompClient) {
        console.error('Cannot make move: STOMP client is not connected.');
        return false;
      }

      // Optimistically update the local state via the store's move action
      if (move({ from, to })) {
        // If the local move is valid, send it to the server via WebSocket
        stompClient.publish({
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
          destination: `/app/game/${gameId}`,
          body: JSON.stringify({ from, to }),
        });
        return true;
      }
      return false;
    },
    [gameId, move, stompClient],
  );

  // Subscribe to the game's topic for real-time state updates from the server.
  useSubscription(
    `/topic/game/${gameId}`,
    (message) => {
      const gameData = deserializeState(JSON.parse(message.body));
      handleTopicMessage(gameData);
    },
    {
      // Ensure you handle authentication for the subscription
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    },
  );

  // --- Game Actions ---

  const resign = useCallback(async () => {
    await appAxios.post(`/game/${gameId}/resign`);
  }, [gameId]);

  const offerDraw = useCallback(async () => {
    await appAxios.post(`/game/${gameId}/offer-draw`);
  }, [gameId]);

  const declineDraw = useCallback(async () => {
    await appAxios.post(`/game/${gameId}/decline-draw`);
  }, [gameId]);

  // Return all the necessary state and functions to the component.
  return {
    game: gameState,
    fen,
    onMove,
    playingColor,
    isLoading,
    resign,
    declineDraw,
    offerDraw,
    isPlayWithBot: data?.isGameWithBot ?? false,
  };
}
