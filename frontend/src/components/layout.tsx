import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div style={{ display: 'flex' }}>
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
