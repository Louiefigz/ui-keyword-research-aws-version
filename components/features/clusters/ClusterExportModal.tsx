'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/overlays';
import { Button } from '@/components/ui/base';
import { useExportClusters } from '@/lib/hooks/use-clusters';
import { Download, Loader2 } from 'lucide-react';
import type { MultipleClusterExportRequest } from '@/types';

interface ClusterExportModalProps {
  projectId: string;
  selectedClusterIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClusterExportModal({
  projectId,
  selectedClusterIds,
  open,
  onOpenChange
}: ClusterExportModalProps) {
  const [exportType, setExportType] = useState<'all' | 'selected'>('selected');
  const [format, setFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [includeAllKeywords, setIncludeAllKeywords] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const exportMutation = useExportClusters();

  // Clear error when modal opens
  React.useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  const handleExport = async () => {
    setError(null);
    
    const exportRequest: MultipleClusterExportRequest = {
      export_format: format,
      include_all_keywords: includeAllKeywords,
      ...(exportType === 'selected' && { cluster_ids: selectedClusterIds })
    };

    try {
      await exportMutation.mutateAsync({ projectId, exportRequest });
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
      setError(error instanceof Error ? error.message : 'Export failed. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Export Clusters</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Choose your export preferences
          </p>
        </DialogHeader>

        <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Export Scope</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="all"
                    checked={exportType === 'all'}
                    onChange={(e) => setExportType('all')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Export All Clusters</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="selected"
                    checked={exportType === 'selected'}
                    onChange={(e) => setExportType('selected')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    Export Selected Only ({selectedClusterIds.length} clusters)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'csv' | 'excel' | 'json')}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="json">JSON</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeAllKeywords}
                  onChange={(e) => setIncludeAllKeywords(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Include all keywords (not just previews)</span>
              </label>
            </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={exportMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={exportMutation.isPending || (exportType === 'selected' && selectedClusterIds.length === 0)}
            className="flex items-center gap-2"
          >
            {exportMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}