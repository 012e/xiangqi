import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Outlet } from 'react-router';
import { Providers } from '@/main';

export default function Layout() {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Outlet />
        </div>
      </SidebarProvider>
    </Providers>
  );
}
