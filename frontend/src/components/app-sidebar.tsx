'use client';

import type * as React from 'react';
import { Bomb, BookOpen, Globe, Settings2, SquareTerminal, SquareUser } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth0 } from '@auth0/auth0-react';
import { NavHeader } from './navbar/nav-header.tsx';
import { NavContent, NavItem } from './navbar/nav-content.tsx';
import { NavUser } from './navbar/nav-user.tsx';
import { Button } from './ui/button';
import { SiLichess } from 'react-icons/si';

const teams = {
  name: 'Chinese Chess',
  logo: SiLichess,
  plan: 'Xiangqi',
  url: '/play',
};

const navItems: NavItem[] = [
  {
    title: 'Playground',
    url: '#',
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: 'Play Online',
        url: '/play/online',
      },
      {
        title: 'Play with friends',
        url: '/play/friend',
      },
      {
        title: 'Play with bot',
        url: '/play/bot',
      },
    ],
  },
  {
    title: 'Document',
    url: '#',
    icon: BookOpen,
    items: [
      {
        title: 'Guide',
        url: '#',
      },
      {
        title: 'Rule',
        url: '#',
      },
      {
        title: 'Tip and trick',
        url: '#',
      },
    ],
  },
  {
    title: 'Social',
    url: '#',
    icon: Globe,
    items: [
      {
        title: 'Chat',
        url: '/social/friend',
      },
      {
        title: 'Friends',
        url: '#',
      },
    ],
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: SquareUser,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings2,
  },
];

function LoginRegister() {
  const { loginWithRedirect } = useAuth0();
  async function login() {
    await loginWithRedirect();
  }
  async function register() {
    await loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  }

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={register}>Register</Button>
      <Button onClick={login} variant={'outline'}>
        Login
      </Button>
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isAuthenticated } = useAuth0();
  const usr: { name: string; email?: string; avatar?: string } = {
    name: user?.name ?? 'Name error',
    email: user?.email,
    avatar: '/avatars/shadcn.jpg',
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavContent items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        {!isAuthenticated ? <LoginRegister /> : <NavUser user={usr} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
