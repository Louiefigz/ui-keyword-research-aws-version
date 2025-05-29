'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/overlays';
import { Button } from '@/components/ui/base';
import { Tabs } from '@/components/ui/data-display/tabs-custom';
import { ClusterOverview } from './ClusterOverview';
import { ClusterKeywordsTable } from './ClusterKeywordsTable';
import { ClusterRecommendations } from './ClusterRecommendations';
import { Download, X } from 'lucide-react';
import type { Cluster } from '@/types';

interface ClusterDetailModalProps {
  cluster: Cluster | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClusterDetailModal({ cluster, open, onOpenChange }: ClusterDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Reset tab to overview when modal opens
  React.useEffect(() => {
    if (open) {
      setActiveTab('overview');
    }
  }, [open]);

  if (!cluster) return null;

  const handleExport = (format: 'csv' | 'xlsx') => {
    // Export functionality will be implemented when API endpoints are available
    // TODO: Implement export when API endpoints are available
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <ClusterOverview cluster={cluster} />
    },
    {
      id: 'keywords',
      label: `Keywords (${cluster.keywords?.length || 0})`,
      content: <ClusterKeywordsTable keywords={cluster.keywords || []} />
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      content: <ClusterRecommendations cluster={cluster} />
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold">{cluster.name}</h2>
            <p className="text-muted-foreground mt-1">{cluster.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              disabled={false}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            tabs={tabs}
            className="w-full"
          />
        </div>
      </div>
    </Dialog>
  );
}