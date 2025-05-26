'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProjectSelector } from './ProjectSelector';
import { UserMenu } from './UserMenu';
import { Button } from '@/components/ui';
import { PlusCircle } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { LAYOUT } from '@/config/ui.constants';

export function Navbar() {
  const pathname = usePathname();
  const { openModal } = useUIStore();
  const isProjectRoute = pathname.includes('/projects/');

  return (
    <nav 
      className="sticky top-0 z-50 w-full border-b bg-card shadow-soft"
      style={{ height: `${LAYOUT.NAVBAR_HEIGHT}px` }}
    >
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold">Keyword Research</span>
          </Link>
          
          {isProjectRoute && (
            <>
              <div className="h-6 w-px bg-border" />
              <ProjectSelector />
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isProjectRoute && (
            <Button
              onClick={() => openModal('createProject')}
              size="sm"
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          )}
          
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}