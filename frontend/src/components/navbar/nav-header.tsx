'use client';

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar.tsx';
import { Link } from 'react-router';

export function NavHeader({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
    url: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link className="flex space-x-2 w-full" to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-ring text-sidebar-primary-foreground">
                  <teams.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{teams.name}</span>
                  <span className="truncate text-xs">{teams.plan}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
