import { useState } from 'react';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { useAuth0 } from '@auth0/auth0-react';
import Xiangqi from '@/lib/xiangqi';

// WARN: chưa có kiểm tra nước đi hợp lệ
export function useOnlineGame(gameId: string | undefined) {
  if (!gameId) {
    throw new Error('Game ID is required');
  }
  const { user } = useAuth0();
  const stompClient = useStompClient();
  const [game, setGame] = useState(new Xiangqi());

  function onMove(from: string, to: string, _piece: string): boolean {
    if (!stompClient) {
      console.log('No stomp client');
      return false;
    }
    const gameCopy: Xiangqi = Object.create(game) as Xiangqi;
    const move = gameCopy.move({ from, to });
    setGame(gameCopy);

    if (!move) return false;

    stompClient.publish({
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
      destination: `/app/game/${gameId}`,
      body: JSON.stringify({ from, to }),
    });

    return true;
  }

  useSubscription(
    `/user/${user?.sub}/game/${gameId}`,
    (message) => {
      const { from, to } = JSON.parse(message.body);
      if (!stompClient) {
        console.log('No stomp client');
        return;
      }
      const gameCopy: Xiangqi = Object.create(game) as Xiangqi;
      const move = gameCopy.move({ from, to });
      setGame(gameCopy);

      if (!move) return;

      stompClient.publish({
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
        destination: `/app/game/${gameId}`,
        body: JSON.stringify({ from, to }),
      });
    },
    {
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    },
  );

  return { game, onMove };
}
