import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { useGameActions, useGameStore } from '@/stores/online-game-store';
import { deserializeState } from './state';
import { useGetGame } from '../api/game-controller/game-controller';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useMemo, useState } from 'react';

export function useOnlineGame(gameId: string | undefined) {
  if (!gameId) {
    throw new Error('Game ID is required');
  }
  const stompClient = useStompClient();
  const { user } = useAuth0();
  const [isFirstRun, setIsFirstRun] = useState(true);

  const { init } = useGameActions();

  // Access store actions and state
  const gameState = useGameStore((state) => state.gameState);
  const playerColor = useGameStore((state) => state.playerColor);
  const playingColor = useGameStore((state) => state.playingColor);
  const { move, handleTopicMessage } = useGameStore((state) => state.actions);

  const {
    data,
    isLoading: gameStateLoading,
    error,
    isError,
  } = useGetGame(gameId, {
    query: {
      gcTime: 0, // Replaces `cacheTime` in v5
      staleTime: 0, // Always treat data as stale
    },
  });

  const isLoading = useMemo(() => {
    return gameStateLoading || !stompClient;
  }, [gameStateLoading, stompClient]);

  if (isError) console.log(error);

  useEffect(() => {
    if (!data) return;
    if (!isFirstRun) {
      return;
    }

    const fen = data.uciFen?.substring(0, data.uciFen?.indexOf('|')).trim();

    init({
      gameId: gameId,
      isStarted: false,
      playerColor: user!.sub! === data.whitePlayer?.sub ? 'white' : 'black',
      playingColor: 'white',
      player: user!.sub!,
      initialFen: fen,
      timeBlack: data.blackTimeLeft,
      timeWhite: data.whiteTimeLeft,

      isEnded: false,
    });
    setIsFirstRun(false);
  }, [data, isFirstRun]);

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

  return {
    game: gameState,
    fen: useGameStore((state) => state.fen),
    onMove,
    playerColor,
    playingColor,
    isLoading,
  };
}
