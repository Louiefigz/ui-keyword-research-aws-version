'use client';

import { MainLayout } from '@/components/layout';
import { CreateProjectForm } from '@/components/features/projects/CreateProjectForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground mt-2">
            Set up a new keyword research project to start analyzing SEO opportunities.
          </p>
        </div>
        <CreateProjectForm />
      </div>
    </MainLayout>
  );
}