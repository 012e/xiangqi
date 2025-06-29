import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { Outlet } from 'react-router';
import { usePrefetchGameTypes } from '@/hooks/use-prefetch-game-types';
import { useEffect } from 'react';
import { cacheWarmupService } from '@/services/CacheWarmupService';

export default function Layout() {
  // Prefetch game types early for better performance
  usePrefetchGameTypes();

  // Warm up caches on app initialization
  useEffect(() => {
    cacheWarmupService.warmupCaches();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
