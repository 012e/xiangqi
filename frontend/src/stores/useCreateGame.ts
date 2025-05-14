import { useAuth0 } from '@auth0/auth0-react';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { toast } from 'sonner';

type Game = {
  gameId: string;
  whitePlayerId: string;
  blackPlayerId: string;
};

export function useCreateGame() {
  const { user } = useAuth0();
  const stompClient = useStompClient();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useSubscription(`/user/${user?.sub}/game/join`, (message) => {
    const game = JSON.parse(message.body) as Game;
    navigate(`/game/${game.gameId}`);
  });

  const createGame = useCallback((gameTypeId: number) => {
    if (!stompClient) {
      toast.error('Backend not connected');
      return;
    }

    stompClient.publish({
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
      destination: '/app/game/join',
      body: JSON.stringify({
        gameTypeId: gameTypeId,
      }),
    });

    setLoading(true);
  }, [stompClient]);

  return { createGame, loading, user };
}
