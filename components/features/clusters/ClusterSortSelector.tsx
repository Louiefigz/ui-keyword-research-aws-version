'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/forms/select';
import type { ClusterSortOptions } from '@/types';

interface ClusterSortSelectorProps {
  sort: ClusterSortOptions;
  onSortChange: (sort: ClusterSortOptions) => void;
}

export function ClusterSortSelector({ sort, onSortChange }: ClusterSortSelectorProps) {
  const handleChange = (value: string) => {
    const [field, order] = value.split('-') as [ClusterSortOptions['field'], ClusterSortOptions['order']];
    onSortChange({ field, order });
  };

  const currentValue = `${sort.field}-${sort.order}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select sort order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="opportunityScore-desc">Opportunity Score (High to Low)</SelectItem>
          <SelectItem value="opportunityScore-asc">Opportunity Score (Low to High)</SelectItem>
          <SelectItem value="totalVolume-desc">Search Volume (High to Low)</SelectItem>
          <SelectItem value="totalVolume-asc">Search Volume (Low to High)</SelectItem>
          <SelectItem value="keywordCount-desc">Keywords (Most to Least)</SelectItem>
          <SelectItem value="keywordCount-asc">Keywords (Least to Most)</SelectItem>
          <SelectItem value="difficulty-asc">Difficulty (Easy to Hard)</SelectItem>
          <SelectItem value="difficulty-desc">Difficulty (Hard to Easy)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}