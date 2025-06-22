'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar.tsx';

import { NavLink } from 'react-router';
import { ModeToggle } from '../mode-toggle.tsx';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import AlertLogin from '../popups/alert-login.tsx';


export type NavSubItem = {
  title: string;
  url: string;
};

export type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
};

function NavItemWithSubItems({ item }: { item: NavItem }) {
  const { isAuthenticated } = useAuth0();
  const [showAlert, setShowAlert] = useState(false);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isAuthenticated) {
      e.preventDefault(); 
      setShowAlert(true); 
    }
  };

  return (
    <>
      <AlertLogin showAlert={showAlert} setShowAlert={setShowAlert} />
      <Collapsible
        asChild
        defaultOpen={item.isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <NavLink to={subItem.url} onClick={handleClick}>
                      <span>{subItem.title}</span>
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </>
  );
}

function NavItemWithoutSubItems({ item }: { item: NavItem }) {
  const { isAuthenticated } = useAuth0();
  const [showAlert, setShowAlert] = useState(false);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isAuthenticated) {
      e.preventDefault(); // Prevent navigation
      setShowAlert(true); // Show alert dialog
    }
  };

  return (
    <>
     
      <AlertLogin showAlert={showAlert} setShowAlert={setShowAlert} />
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.title}>
          <NavLink to={item.url} onClick={handleClick}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}

function ThemeButton() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip="Theme">
        <ModeToggle />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function NavContent({ items }: { items: NavItem[]}) {
  
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0 ? (
            <NavItemWithSubItems key={item.title} item={item} />
          ) : (
            <NavItemWithoutSubItems key={item.title} item={item} />
          ),
        )}
        <ThemeButton />
      </SidebarMenu>
    </SidebarGroup>
  );
}
