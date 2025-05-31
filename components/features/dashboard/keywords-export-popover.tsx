'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/base/button';
import { Label } from '@/components/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/forms/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/overlays/popover';

interface KeywordExportPopoverProps {
  isExporting: boolean;
  onExport: (format: 'csv' | 'excel' | 'json') => void;
  projectId?: string;
  totalItems: number;
}

export function KeywordExportPopover({
  isExporting,
  onExport,
  projectId,
  totalItems
}: KeywordExportPopoverProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [exportPopoverOpen, setExportPopoverOpen] = useState(false);

  const handleExport = () => {
    onExport(exportFormat);
    setTimeout(() => {
      setExportPopoverOpen(false);
    }, 500);
  };

  return (
    <Popover open={exportPopoverOpen} onOpenChange={setExportPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" disabled={!projectId || isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Export Keywords</h3>
            <p className="text-sm text-gray-600">
              Export {totalItems} keywords with current filters
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={exportFormat} onValueChange={(value: 'csv' | 'excel' | 'json') => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="json">JSON (.json)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setExportPopoverOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}