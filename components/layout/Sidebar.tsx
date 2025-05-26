'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Upload,
  LayoutDashboard,
  Network,
  Lightbulb,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  projectId: string;
  className?: string;
}

interface NavItem {
  href: string;
  icon: typeof Upload;
  label: string;
  badge?: string | number;
}

export function Sidebar({ projectId, className }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const navItems: NavItem[] = [
    {
      href: `/projects/${projectId}/upload`,
      icon: Upload,
      label: 'Upload CSV',
    },
    {
      href: `/projects/${projectId}/dashboard`,
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: `/projects/${projectId}/clusters`,
      icon: Network,
      label: 'Clusters',
    },
    {
      href: `/projects/${projectId}/strategic-advice`,
      icon: Lightbulb,
      label: 'Strategic Advice',
    },
    {
      href: `/projects/${projectId}/settings`,
      icon: Settings,
      label: 'Settings',
    },
  ];

  return (
    <aside
      className={cn(
        'relative border-r bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-1 p-3">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start gap-3',
                          isActive && 'bg-accent text-accent-foreground',
                          sidebarCollapsed && 'justify-center px-0'
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {sidebarCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              'w-full',
              sidebarCollapsed && 'justify-center px-0'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}