'use client';

import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Badge } from '@/components/ui/base/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/data-display/table';

interface SchemaPreviewProps {
  schema: any; // SchemaDetection type from API
  fileName: string;
}

export function SchemaPreview({ schema, fileName }: SchemaPreviewProps) {
  const confidencePercent = Math.round(schema.confidence_score * 100);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Schema Detection Results</CardTitle>
            <CardDescription className="mt-1">
              Detected format for {fileName}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <FileText className="h-3 w-3" />
              {schema.detected_tool}
            </Badge>
            <Badge 
              variant={confidencePercent >= 80 ? 'success' : 'warning'}
              className="gap-1"
            >
              {confidencePercent}% confidence
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* CSV Type */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">CSV Type:</span>
          <Badge variant="secondary">{schema.csv_type}</Badge>
        </div>

        {/* Field Mappings */}
        <div>
          <h4 className="text-sm font-medium mb-3">Field Mappings</h4>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CSV Column</TableHead>
                  <TableHead>Maps To</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Required</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schema.field_mappings.map((mapping: any) => (
                  <TableRow key={mapping.source_column}>
                    <TableCell className="font-mono text-sm">
                      {mapping.source_column}
                    </TableCell>
                    <TableCell className="font-medium">
                      {mapping.target_field}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {mapping.data_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {mapping.is_required ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Missing Required Fields */}
        {schema.missing_required_fields && schema.missing_required_fields.length > 0 && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Missing Required Fields</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The following required fields were not found: {schema.missing_required_fields.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unmapped Columns */}
        {schema.unmapped_columns && schema.unmapped_columns.length > 0 && (
          <div className="rounded-lg border border-warning/50 bg-warning/10 p-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Unmapped Columns</p>
                <p className="text-sm text-muted-foreground mt-1">
                  These columns will be ignored: {schema.unmapped_columns.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sample Data Preview */}
        {schema.sample_data && schema.sample_data.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">Sample Data Preview</h4>
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      {Object.keys(schema.sample_data[0]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-2 text-left text-xs font-medium text-muted-foreground"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {schema.sample_data.slice(0, 3).map((row: any, idx: number) => (
                      <tr key={idx}>
                        {Object.values(row).map((value: any, cellIdx: number) => (
                          <td key={cellIdx} className="px-4 py-2 text-sm">
                            {value?.toString() || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Showing first 3 rows of {schema.sample_data.length}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}