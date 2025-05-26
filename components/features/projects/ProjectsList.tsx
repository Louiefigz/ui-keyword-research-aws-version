'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  MoreVertical, 
  Archive, 
  Trash2, 
  Settings,
  FileText,
  BarChart3 
} from 'lucide-react';
import { useProjects, useArchiveProject, useDeleteProject } from '@/lib/hooks/use-projects';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/data-display/card';
import { Button } from '@/components/ui/base/button';
import { Badge } from '@/components/ui/base/badge';
import { LoadingSpinner } from '@/components/ui/feedback/loading-spinner';
import { EmptyState } from '@/components/ui/feedback/empty-state';
import { ErrorState } from '@/components/ui/feedback/error-state';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/navigation/dropdown-menu';
import { CreateProjectModal } from './CreateProjectModal';
import { formatDate } from '@/utils/format';

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

function StatItem({ label, value, icon }: StatItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium">{value.toLocaleString()}</span>
    </div>
  );
}

export function ProjectsList() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: response, isLoading, error } = useProjects();
  const archiveMutation = useArchiveProject();
  const deleteMutation = useDeleteProject();
  
  const projects = response?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load projects"
        message="There was an error loading your projects. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const handleArchive = async (projectId: string) => {
    try {
      await archiveMutation.mutateAsync(projectId);
    } catch {
      // Error handling will be in the mutation
    }
  };

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(projectId);
      } catch {
        // Error handling will be in the mutation
      }
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <>
        <EmptyState
          title="No projects yet"
          description="Create your first project to start analyzing keywords"
          action={{
            label: 'Create Project',
            onClick: () => setShowCreateModal(true),
          }}
          icon={PlusCircle}
        />
        <CreateProjectModal 
          open={showCreateModal} 
          onOpenChange={setShowCreateModal}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/projects/${project.id}/dashboard`)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {project.business_description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/projects/${project.id}/settings`);
                    }}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/projects/${project.id}/upload`);
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Upload CSV
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(project.id);
                    }}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge 
                variant={project.status === 'active' ? 'default' : 'secondary'}
                className="mt-2"
              >
                {project.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <StatItem 
                label="Keywords" 
                value={project.stats.total_keywords}
                icon={<FileText className="h-3 w-3" />}
              />
              <StatItem 
                label="Clusters" 
                value={project.stats.total_clusters}
                icon={<BarChart3 className="h-3 w-3" />}
              />
              <StatItem 
                label="Avg. Opportunity Score" 
                value={project.stats.avg_opportunity_score.toFixed(1)}
              />
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Created {formatDate(project.created_at)}
            </CardFooter>
          </Card>
        ))}
      </div>

      <CreateProjectModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}