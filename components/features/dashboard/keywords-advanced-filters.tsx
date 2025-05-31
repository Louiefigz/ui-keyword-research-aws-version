'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/base/button';
import { Input } from '@/components/ui/forms/input';
import { Label } from '@/components/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/forms/select';
import { KeywordFilters } from '@/types/api.types';

interface KeywordAdvancedFiltersProps {
  tempFilters: KeywordFilters;
  onTempFiltersChange: (filters: KeywordFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onClose: () => void;
}

export function KeywordAdvancedFilters({
  tempFilters,
  onTempFiltersChange,
  onApplyFilters,
  onResetFilters,
  onClose
}: KeywordAdvancedFiltersProps) {
  const updateTempFilters = (updates: Partial<KeywordFilters>) => {
    onTempFiltersChange({ ...tempFilters, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Advanced Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Volume Range */}
        <div className="space-y-2">
          <Label>Search Volume</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={tempFilters.minVolume || ''}
              onChange={(e) => updateTempFilters({
                minVolume: e.target.value ? parseInt(e.target.value) : undefined
              })}
            />
            <Input
              type="number"
              placeholder="Max"
              value={tempFilters.maxVolume || ''}
              onChange={(e) => updateTempFilters({
                maxVolume: e.target.value ? parseInt(e.target.value) : undefined
              })}
            />
          </div>
        </div>

        {/* Difficulty Range */}
        <div className="space-y-2">
          <Label>Keyword Difficulty</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={tempFilters.minDifficulty || ''}
              onChange={(e) => updateTempFilters({
                minDifficulty: e.target.value ? parseInt(e.target.value) : undefined
              })}
            />
            <Input
              type="number"
              placeholder="Max"
              value={tempFilters.maxDifficulty || ''}
              onChange={(e) => updateTempFilters({
                maxDifficulty: e.target.value ? parseInt(e.target.value) : undefined
              })}
            />
          </div>
        </div>

        {/* Intent Filter */}
        <div className="space-y-2">
          <Label>Search Intent</Label>
          <Select 
            value={tempFilters.intent?.[0] || 'all'} 
            onValueChange={(value) => updateTempFilters({
              intent: value === 'all' ? undefined : [value]
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Intents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Intents</SelectItem>
              <SelectItem value="informational">Informational</SelectItem>
              <SelectItem value="navigational">Navigational</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="transactional">Transactional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          Reset
        </Button>
        <Button size="sm" onClick={onApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}