import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/projects" className="mt-8">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
}