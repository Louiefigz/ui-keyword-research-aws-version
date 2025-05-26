'use client';

import { MainLayout } from '@/components/layout';
import { ProjectsList } from '@/components/features/projects/ProjectsList';

export default function ProjectsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your keyword research projects and track SEO performance.
          </p>
        </div>
        <ProjectsList />
      </div>
    </MainLayout>
  );
}