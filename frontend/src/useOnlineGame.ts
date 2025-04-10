import { useEffect } from 'react';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { useGameStore } from '@/stores/onlineGame'; // Import your store

export function useOnlineGame(gameId: string | undefined) {
  if (!gameId) {
    throw new Error('Game ID is required');
  }
  
  const { user } = useAuth0();
  const stompClient = useStompClient();
  
  // Access store actions and state
  const gameState = useGameStore(state => state.gameState);
  const playerColor = useGameStore(state => state.playerColor);
  const playingColor = useGameStore(state => state.playingColor);
  const { move, init } = useGameStore(state => state.actions);
  
  // Initialize the game when hook is first used
  useEffect(() => {
    // Check if we need to initialize (only if not already initialized with this game ID)
    if (useGameStore.getState().id !== gameId) {
      init({
        gameId,
        player: user?.sub || 'anonymous',
        playerColor: 'white', // Default to white, might be updated from server
        playingColor: 'white', // Default starting color
        timeBlack: 60 * 3 * 1000, // 3 minutes
        timeWhite: 60 * 3 * 1000,
        isStarted: false,
        // initialFen would come from the server
      });
    }
    
    // Cleanup function
    return () => {
      const interval = useGameStore.getState().interval;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameId, user?.sub]);
  
  function onMove(from: string, to: string, _piece: string): boolean {
    if (!stompClient) {
      console.log('No stomp client');
      return false;
    }
    
    // Check if move is valid
    const isValid = gameState.isLegalMove({ from, to }).ok;
    
    if (isValid) {
      // Update local store first
      move({ from, to });
      
      // Send move to server
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
  }
  
  // Subscribe to opponent moves
  useSubscription(
    `/user/${user?.sub}/game/${gameId}`,
    (message) => {
      const { from, to } = JSON.parse(message.body);
      
      // Update our store with the opponent's move
      move({ from, to });
    },
    {
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    },
  );
  
  // Subscribe to game state updates
  useSubscription(
    `/topic/game/${gameId}/state`,
    (message) => {
      const gameData = JSON.parse(message.body);
      
      // Update game state from server
      init({
        gameId,
        player: user?.sub || 'anonymous',
        playerColor: gameData.playerColor,
        playingColor: gameData.playingColor,
        timeBlack: gameData.blackTime,
        timeWhite: gameData.whiteTime,
        isStarted: gameData.isStarted,
        initialFen: gameData.fen,
      });
    },
    {
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    },
  );
  
  return { 
    game: gameState, 
    onMove,
    playerColor,
    playingColor
  };
}