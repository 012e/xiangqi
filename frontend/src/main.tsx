import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import '@/styles/index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StompSessionProvider } from 'react-stomp-hooks';
import { Toaster } from './components/ui/sonner.tsx';
import PlayGame from './pages/play/play-game.tsx';
import NewGame from './pages/play/new-game.tsx';
import OnlineGame from './pages/play/online-game.tsx';
import PlayOnline from './pages/play/play-online.tsx';
import Layout from './components/layout.tsx';
import PlayBot from './pages/play/play-bot.tsx';
import PlayFriend from './pages/play/play-friend.tsx';
import SettingPage from './pages/setting/setting-page.tsx';
import { useBackendUrl } from './stores/setting-store.ts';

const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  const backendUrl = useBackendUrl();
  const stompUrl = useMemo(() => new URL("ws", backendUrl).toString(), [backendUrl]);

  return (
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain="dev-l5aemj1026u4dqia.us.auth0.com"
        clientId="3WDtuCDz2foYFJAHjKc2FxTTJmplDfL6"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: 'xiangqi-backend',
        }}
        cacheLocation="localstorage"
      >
        <StompSessionProvider url={stompUrl} key={stompUrl}>
          {children}
          <Toaster />
        </StompSessionProvider>
      </Auth0Provider>
    </QueryClientProvider>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="/play" element={<PlayGame />} />
            <Route path="/play/online" element={<PlayOnline />} />
            <Route path="/play/bot" element={<PlayBot />} />
            <Route path="/play/friend" element={<PlayFriend />} />
            <Route path="/game/new" element={<NewGame />} />
            <Route path="/game/:id" element={<OnlineGame />} />
            <Route path="/setting" element={<SettingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  </StrictMode>,
);
