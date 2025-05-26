'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/lib/store/ui-store';
import { cn } from '@/lib/utils';
import { LAYOUT } from '@/lib/constants/ui.constants';

interface MainLayoutProps {
  children: ReactNode;
  projectId?: string;
}

export function MainLayout({ children, projectId }: MainLayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex" style={{ height: `calc(100vh - ${LAYOUT.NAVBAR_HEIGHT}px)` }}>
        {projectId && (
          <Sidebar 
            projectId={projectId} 
            className={cn(
              'transition-all duration-300',
              sidebarCollapsed ? 'w-16' : 'w-64'
            )}
          />
        )}
        <main 
          className={cn(
            'flex-1 overflow-y-auto custom-scrollbar',
            'transition-all duration-300'
          )}
        >
          <div className="container mx-auto p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}