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

export type NewGameProps = {
  playWithComputer?: boolean;
  strength?: number;
  gameTypeId: number;
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

  const createGame = useCallback(
    ({
      gameTypeId,
      playWithComputer = false,
      strength = undefined,
    }: NewGameProps) => {
      if (!stompClient) {
        toast.error('Backend not connected');
        return;
      }

      function handlePlayWithComputer(strength?: number): string | undefined {
        if (strength === undefined) {
          toast.error('Please select a computer strength');
          return;
        }
        if (strength < -20 || strength > 20) {
          toast.error('Computer strength must be between -20 and 20');
          return;
        }

        return JSON.stringify({
          type: 'bot',
          gameTypeId: gameTypeId,
          strength: strength,
        });
      }

      let message: string | undefined;
      if (playWithComputer) {
        message = handlePlayWithComputer(strength);
      } else {
        message = JSON.stringify({
          type: 'normal',
          gameTypeId: gameTypeId,
        });
      }

      if (message) {
        stompClient.publish({
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
          destination: '/app/game/join',
          body: message,
        });
        setLoading(true);
      }
    },
    [stompClient],
  );

  return { createGame, loading, user };
}
