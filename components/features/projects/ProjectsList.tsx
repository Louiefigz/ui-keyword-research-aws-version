'use client';

import { useRouter } from 'next/navigation';
import { PlusCircle, MoreVertical, Archive, Trash2 } from 'lucide-react';
import { useProjects } from '@/lib/hooks/use-projects';
import { useUIStore } from '@/lib/store/ui-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export function ProjectsList() {
  const router = useRouter();
  const { data: projects, isLoading, error } = useProjects();
  const { openModal } = useUIStore();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message || 'Failed to load projects'} />;
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project to start analyzing keywords"
        action={{
          label: 'Create Project',
          onClick: () => openModal('createProject'),
        }}
        icon={PlusCircle}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="cursor-pointer transition-all hover:shadow-medium"
          onClick={() => router.push(`/projects/${project.id}/dashboard`)}
        >
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {project.business_description}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                  {project.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Keywords</span>
                <span className="font-medium">{project.stats.total_keywords}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Clusters</span>
                <span className="font-medium">{project.stats.total_clusters}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. Score</span>
                <span className="font-medium">
                  {project.stats.avg_opportunity_score.toFixed(1)}
                </span>
              </div>
              <div className="pt-3 border-t text-xs text-muted-foreground">
                Created {format(new Date(project.created_at), 'MMM d, yyyy')}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}