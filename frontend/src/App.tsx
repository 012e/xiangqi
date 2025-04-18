import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import NewGame from './pages/play/new-game';
import SelfPlayBoard from './pages/play/self-playboard';

function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const [player, setPlayer] = useState<'white' | 'black'>('white');

  function togglePlayer() {
    setPlayer((prev) => (prev === 'white' ? 'black' : 'white'));
  }

  const login = async () => {
    await loginWithRedirect();
  };

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        localStorage.setItem('access_token', token);
      });
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="w-screen">
      <div className="flex flex-col gap-10 justify-center items-center p-20">
        <div className="flex justify-center items-center w-full h-full">
          {!isAuthenticated ? (
            <Button onClick={login}>Login</Button>
          ) : (
            <div className="flex flex-col">
              <h1>Welcome, {user!.name}</h1>
              <h2>Email: {user!.email}</h2>
              <h2>Sub: {user!.sub}</h2>
              <div className="flex gap-5 w-full flew-row">
                <NewGame className="w-1/2" />
                <Button
                  onClick={() => logout()}
                  variant="destructive"
                  className="w-1/2"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5 items-center w-full h-full">
          <div>
            <Button onClick={togglePlayer}>Change color</Button>
          </div>
          <div className="w-1/2 h-1/2">
            <SelfPlayBoard boardOrientation={player} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
