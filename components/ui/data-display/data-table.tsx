'use client';

import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { LoadingSpinner } from '../feedback/loading-spinner';
import { EmptyState } from '../feedback/empty-state';
import { ErrorState } from '../feedback/error-state';
import { cn } from '@/lib/utils';

export type Column<T> = ColumnDef<T>;

export interface ColumnDef<T> {
  id: string;
  header: string | ReactNode;
  accessor: keyof T | ((row: T) => unknown);
  cell?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedRows?: Set<string>;
  onRowSelect?: (id: string, selected: boolean) => void;
  getRowId?: (row: T) => string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  error = null,
  emptyMessage = 'No data found',
  onRowClick,
  selectedRows,
  getRowId = (row) => row.id as string,
  className,
}: Omit<DataTableProps<T>, 'onRowSelect'>) {
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  const getCellValue = (row: T, column: ColumnDef<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };
  
  const getRowKey = (row: T, index: number): string => {
    try {
      return getRowId(row);
    } catch {
      return `row-${index}`;
    }
  };

  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                style={{ width: column.width }}
                className={cn(
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const rowId = getRowId(row);
            const isSelected = selectedRows?.has(rowId);

            return (
              <TableRow
                key={getRowKey(row, index)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-muted/50',
                  isSelected && 'bg-muted'
                )}
              >
                {columns.map((column) => {
                  const value = getCellValue(row, column);
                  const content = column.cell ? column.cell(value, row) : value;

                  return (
                    <TableCell
                      key={column.id}
                      className={cn(
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}