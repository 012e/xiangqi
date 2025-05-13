import { StrictMode, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
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
import SettingProfile from './pages/settings/setting-page.tsx';
import Friends from './pages/social/friends.tsx';
import Demo from './pages/test/test.tsx';

import SettingPage from './pages/settings/setting-form.tsx';
import { useBackendUrl, useTheme } from './stores/setting-store.ts';

const queryClient = new QueryClient();

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

              <Route path="/settings" element={<SettingProfile />} />
              <Route path="/settings/profile" element={<SettingProfile />} />
              <Route path="/social" element={<Friends />} />
              <Route path="/social/friend" element={<Friends />} />

              <Route path="/play/demo" element={<Demo />} />
              <Route path="/setting" element={<SettingPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Providers>
  </StrictMode>,
);
