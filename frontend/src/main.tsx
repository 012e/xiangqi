import { StrictMode, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import '@/styles/index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StompSessionProvider } from 'react-stomp-hooks';
import { Toaster } from './components/ui/sonner.tsx';
import NewGame from './pages/play/new-game.tsx';
import OnlineGame from './pages/play/online-game.tsx';
import PlayOnline from './pages/play/play-online.tsx';
import Layout from './components/layout.tsx';
import PlayBot from './pages/play/play-bot.tsx';
import PlayFriend from './pages/play/play-friend.tsx';

import { ThemeProvider } from '@/styles/ThemeContext.tsx';
import SettingProfile from '@/pages/profile/profile-page.tsx';
import Friends from './pages/social/friends.tsx';
import Demo from './pages/test/test.tsx';

import useSettingStore, { useBackendUrl, useTheme } from './stores/setting-store.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();


function AccessTokenProvider({children}: { children: React.ReactNode}) {
  const { getAccessTokenSilently, user } = useAuth0();
  useEffect(() => {
    if (user?.sub) {
      getAccessTokenSilently().then(token => {
        useSettingStore.getState().actions.setToken(token);
      })
    }
  }, [user?.sub, getAccessTokenSilently]);

  return children;
}

function Providers({ children }: { children: React.ReactNode }) {
  const backendUrl = useBackendUrl();
  const stompUrl = useMemo(
    () => new URL('ws', backendUrl).toString(),
    [backendUrl],
  );
  const theme = useTheme();

  // set theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

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

        <AccessTokenProvider>
        <StompSessionProvider url={stompUrl} key={stompUrl}>
          {children}
          <Toaster />
        </StompSessionProvider>
        </AccessTokenProvider>
      </Auth0Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<App />} />
              <Route path="/play/online" element={<PlayOnline />} />
              <Route path="/play/bot" element={<PlayBot />} />
              <Route path="/play/friend" element={<PlayFriend />} />
              <Route path="/game/new" element={<NewGame />} />
              <Route path="/game/:id" element={<OnlineGame />} />

              <Route path="/profile" element={<SettingProfile />} />
              <Route path="/social" element={<Friends />} />
              <Route path="/social/friend" element={<Friends />} />

              <Route path="/play/demo" element={<Demo />} />
              <Route path="/demo" element={<Demo />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Providers>
  </StrictMode>,
);
