import { MainLayout } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui';

export default function Loading() {
  return (
    <MainLayout>
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    </MainLayout>
  );
}