'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { useProjects } from '@/lib/hooks/use-projects';
import { useUIStore } from '@/lib/store/ui-store';

export function ProjectSelector() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: projects, isLoading } = useProjects();
  const { currentProject, setCurrentProject, openModal } = useUIStore();

  const handleProjectSelect = (projectId: string) => {
    const selected = projects?.data?.find((p) => p.id === projectId);
    if (selected) {
      setCurrentProject(selected);
      setOpen(false);
      router.push(`/projects/${projectId}/dashboard`);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
          disabled={isLoading}
        >
          {currentProject ? (
            <span className="truncate">{currentProject.name}</span>
          ) : (
            <span className="text-muted-foreground">Select project...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup>
            {projects?.data?.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => handleProjectSelect(project.id)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    currentProject?.id === project.id
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                <div className="flex-1 truncate">
                  <div className="font-medium">{project.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {project.stats.total_keywords} keywords
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <div className="border-t p-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setOpen(false);
                openModal('createProject');
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create new project
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}