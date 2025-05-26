'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/forms';
import { Select } from '@/components/ui/forms';
import { Button } from '@/components/ui/base';
import { X } from 'lucide-react';
import type { ClusterFilters as ClusterFiltersType } from '@/types';

interface ClusterFiltersProps {
  filters: ClusterFiltersType;
  onFiltersChange: (filters: ClusterFiltersType) => void;
}

export function ClusterFilters({ filters, onFiltersChange }: ClusterFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ClusterFiltersType>(filters);

  const handleChange = (key: keyof ClusterFiltersType, value: string | number | string[] | undefined) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ClusterFiltersType = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search clusters..."
          value={localFilters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
        
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min volume"
            value={localFilters.minVolume || ''}
            onChange={(e) => handleChange('minVolume', e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max volume"
            value={localFilters.maxVolume || ''}
            onChange={(e) => handleChange('maxVolume', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min keywords"
            value={localFilters.minKeywords || ''}
            onChange={(e) => handleChange('minKeywords', e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max keywords"
            value={localFilters.maxKeywords || ''}
            onChange={(e) => handleChange('maxKeywords', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>

        <Select
          value={localFilters.intents?.join(',') || ''}
          onValueChange={(value) => handleChange('intents', value ? value.split(',') : [])}
        >
          <option value="">All intents</option>
          <option value="informational">Informational</option>
          <option value="navigational">Navigational</option>
          <option value="commercial">Commercial</option>
          <option value="transactional">Transactional</option>
          <option value="informational,commercial">Informational + Commercial</option>
          <option value="commercial,transactional">Commercial + Transactional</option>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1"
          >
            <X className="w-4 h-4" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}