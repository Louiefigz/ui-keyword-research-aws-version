import { useState } from 'react';
import { KeywordFilters } from '@/types/api.types';

interface UseKeywordExportOptions {
  projectId?: string;
  filters: KeywordFilters;
}

interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
}

export function useKeywordExport({ projectId, filters }: UseKeywordExportOptions) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async ({ format }: ExportOptions) => {
    if (!projectId) {
      console.error('Project ID is required for export');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const exportParams: Record<string, string> = {
        export_format: format,
        client_format: 'true',
        include_clusters: 'true'
      };

      // Map dashboard filters to export parameters
      if (filters.maxDifficulty !== undefined) exportParams.kd_max = filters.maxDifficulty.toString();
      if (filters.minDifficulty !== undefined) exportParams.kd_min = filters.minDifficulty.toString();
      if (filters.intent?.length) exportParams.intent = filters.intent[0];
      if (filters.opportunityLevel?.length) {
        const opportunityMap: Record<string, string> = {
          'low_hanging': 'Low-Hanging Fruit',
          'existing': 'Existing', 
          'clustering': 'Clustering Opportunity',
          'untapped': 'Untapped',
          'success': 'Success',
          'high': 'Low-Hanging Fruit',
          'medium': 'Existing',
          'low': 'Untapped'
        };
        const mappedValue = opportunityMap[filters.opportunityLevel[0]] || filters.opportunityLevel[0];
        exportParams.opportunity = mappedValue;
      }
      if (filters.minVolume !== undefined) exportParams.volume_min = filters.minVolume.toString();
      if (filters.maxVolume !== undefined) exportParams.volume_max = filters.maxVolume.toString();
      if (filters.search) exportParams.search = filters.search;

      // Create download URL
      const params = new URLSearchParams(exportParams);
      const downloadUrl = `/api/proxy/projects/${projectId}/exports/download?${params}`;

      console.log('Export URL:', downloadUrl);
      console.log('Export params:', exportParams);

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const fileExtension = format === 'excel' ? 'xlsx' : format;
      link.download = `keywords-export-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExport
  };
}