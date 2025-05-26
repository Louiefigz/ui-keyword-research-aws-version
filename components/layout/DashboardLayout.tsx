'use client';

import { ReactNode, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from './MainLayout';
import { useProject } from '@/lib/hooks/use-projects';
import { useUIStore } from '@/lib/store/ui-store';
import { LoadingSpinner, ErrorState } from '@/components/ui';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: project, isLoading, error } = useProject(projectId);
  const { setCurrentProject } = useUIStore();

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
  }, [project, setCurrentProject]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorState
          title="Failed to load project"
          message={error.message || 'An error occurred while loading the project'}
        />
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <ErrorState
          title="Project not found"
          message="The project you're looking for doesn't exist or has been deleted"
        />
      </MainLayout>
    );
  }

  return <MainLayout projectId={projectId}>{children}</MainLayout>;
}