'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProject } from '@/lib/hooks/use-projects';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function CreateProjectForm() {
  const router = useRouter();
  const createProject = useCreateProject();
  const [formData, setFormData] = useState({
    name: '',
    business_description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const project = await createProject.mutateAsync(formData);
      router.push(`/projects/${project.id}/upload`);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="E.g., My E-commerce Site SEO"
              required
              disabled={createProject.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              value={formData.business_description}
              onChange={(e) =>
                setFormData({ ...formData, business_description: e.target.value })
              }
              placeholder="Describe your business, target audience, and SEO goals..."
              rows={4}
              required
              disabled={createProject.isPending}
            />
            <p className="text-sm text-muted-foreground">
              This helps generate more relevant strategic advice for your keywords.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={createProject.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}