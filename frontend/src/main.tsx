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

import { ThemeProvider } from '@/styles/ThemeContext.tsx';
import Friends from './pages/social/friends.tsx';
import Demo from './pages/test/test.tsx';

import useSettingStore, {
  useBackendUrl,
  useTheme,
} from './stores/setting-store.ts';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SettingsPage from '@/pages/settings/settings-page.tsx';
import ProfilePage from '@/pages/profile/profile-page.tsx';
import Chat from './pages/social/chat.tsx';
import FindFriendsByUsername from './pages/social/findFriendsByUsername.tsx';
import Guide from './pages/document/Guide.tsx';
import Rule from './pages/document/Rule.tsx';
import FriendInvitationProvider from './components/friend-invitation-provider.tsx';
import InvitationsPage from './pages/invitations/invitations.tsx';
import WaitingPage from './pages/invitations/waiting.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
    },
  },
});

function AccessTokenProvider({ children }: { children: React.ReactNode }) {
  const { getAccessTokenSilently, user } = useAuth0();
  useEffect(() => {
    if (user?.sub) {
      getAccessTokenSilently().then((token) => {
        useSettingStore.getState().actions.setToken(token);
      });
    }
  }, [user?.sub, getAccessTokenSilently]);

  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
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
            <FriendInvitationProvider>{children}</FriendInvitationProvider>
            <Toaster closeButton={true} expand={true} />
          </StompSessionProvider>
        </AccessTokenProvider>
      </Auth0Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route
              path="/play/online"
              element={<PlayOnline isGameWithBot={true} />}
            />
            <Route
              path="/play/bot"
              element={<PlayOnline isGameWithBot={false} />}
            />
            <Route path="/game/new" element={<NewGame />} />
            <Route path="/game/:id" element={<OnlineGame />} />

              <Route path="user/profile/me" element={<ProfilePage />} />
              <Route path="user/profile/:id" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

            <Route path="/social" element={<Friends />} />
            <Route path="/social/friend" element={<Friends />} />
            <Route
              path="/social/friend/findById"
              element={<FindFriendsByUsername />}
            />
            <Route path="/social/chat" element={<Chat />} />

            <Route path="/document" element={<Guide />} />
            <Route path="/document/guide" element={<Guide />} />
            <Route path="/document/rule" element={<Rule />} />

            <Route path="/invitations" element={<InvitationsPage />} />
            <Route path="/invitations/waiting/:id" element={<WaitingPage />} />
          </Route>
          <Route path="/test" element={<Demo />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
