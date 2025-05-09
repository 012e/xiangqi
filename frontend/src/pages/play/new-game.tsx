import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Game = {
  gameId: string;
  whitePlayerId: string;
  blackPlayerId: string;
};

export default function NewGame({ className }: { className?: string }) {
  const { user } = useAuth0();
  const stompClient = useStompClient();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useSubscription(`/user/${user?.sub}/game/join`, (message) => {
    const game = JSON.parse(message.body) as Game;
    navigate(`/game/${game.gameId}`);
  });

  if (!user) {
    return <div>Not logged in yet</div>;
  }

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
      body: JSON.stringify({
        gameTypeId: 1,
      }),
    });
    setLoading(true);
  }

  if (loading) {
    return (
      <Button disabled className={className}>
        <div className="flex justify-center items-center h-16">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </Button>
    );
  }

  return (
    <Button onClick={createGame} className={className}>
      Create game
    </Button>
  );
}
