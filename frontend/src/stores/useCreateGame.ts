import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
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
    let player = 'white';
    if (game.blackPlayerId === user?.sub) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      player = 'black';
    }
    navigate(`/game/${game.gameId}`);
  });

  function createGame() {
    if (!stompClient) {
      toast.error('Backend not connected');
      return;
    }
    stompClient.publish({
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
      destination: '/app/game/join',
      body: JSON.stringify({}),
    });
    setLoading(true);
  }

  return { createGame, loading, user };
}
