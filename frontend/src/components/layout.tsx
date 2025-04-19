import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className="flex">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
