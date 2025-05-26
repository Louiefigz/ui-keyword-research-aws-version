'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProject } from '@/lib/hooks/use-projects';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays/dialog';
import { Button } from '@/components/ui/base/button';
import { Input } from '@/components/ui/forms/input';
import { Label } from '@/components/ui/forms/label';
import { Textarea } from '@/components/ui/forms/textarea';
import { LoadingSpinner } from '@/components/ui/feedback/loading-spinner';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const router = useRouter();
  const createProjectMutation = useCreateProject();
  
  const [formData, setFormData] = useState({
    name: '',
    business_description: '',
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    business_description?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.business_description.trim()) {
      newErrors.business_description = 'Business description is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const project = await createProjectMutation.mutateAsync({
        name: formData.name.trim(),
        business_description: formData.business_description.trim(),
      });
      
      // Reset form
      setFormData({ name: '', business_description: '' });
      setErrors({});
      onOpenChange(false);
      
      // Navigate to upload page
      router.push(`/projects/${project.id}/upload`);
    } catch {
      // Error is handled in the mutation
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', business_description: '' });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new keyword research project. You&apos;ll be able to upload CSV data after creation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g., Summer 2024 Campaign"
                className={errors.name ? 'border-destructive' : ''}
                disabled={createProjectMutation.isPending}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                value={formData.business_description}
                onChange={(e) => {
                  setFormData({ ...formData, business_description: e.target.value });
                  setErrors({ ...errors, business_description: undefined });
                }}
                placeholder="Describe your business, target market, and goals..."
                rows={4}
                className={errors.business_description ? 'border-destructive' : ''}
                disabled={createProjectMutation.isPending}
              />
              {errors.business_description && (
                <p className="text-sm text-destructive">{errors.business_description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                This helps our AI provide better keyword recommendations
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createProjectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}