'use client';

import type * as React from 'react';
import { Bomb, BookOpen, Globe, Settings2, SquareTerminal } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth0 } from '@auth0/auth0-react';
import { NavHeader } from './nav-header';
import { NavContent } from './nav-content';
import { NavUser } from './nav-user';

// This is sample data.
const data = {
  user: {
    name: 'User',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: {
    name: 'Chess',
    logo: Bomb,
    plan: 'Xiangqi',
  },

  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Play Online',
          url: '#',
        },
        {
          title: 'Play with friends',
          url: '#',
        },
        {
          title: 'Play with bot',
          url: '#',
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
          title: 'Friend Link',
          url: '#',
        },
        {
          title: 'Send Email Invite',
          url: '#',
        },
        {
          title: 'Create challenge Link',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Theme',
          url: '#',
        },
        {
          title: 'Account',
          url: '#',
        },
        {
          title: 'Profile',
          url: '#',
        },
      ],
    },
  ],
};

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
        <NavHeader teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavContent items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {!isAuthenticated ? (
          <NavUser user={data.user} />
        ) : (
          <NavUser user={usr} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
