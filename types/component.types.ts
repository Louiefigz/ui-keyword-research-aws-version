// Component prop types

// Layout Components
export interface LayoutProps {
  children: React.ReactNode;
}

export interface NavbarProps {
  className?: string;
}

export interface SidebarProps {
  projectId?: string;
  className?: string;
}

// UI Components
export interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// Data Display Components
export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: Error | null;
  onRowClick?: (row: T) => void;
  className?: string;
}

export interface ColumnDef<T> {
  id: string;
  header: string | React.ReactNode;
  accessor: keyof T | ((row: T) => unknown);
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

// Modal Components
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

// Chart Components
export interface ChartProps {
  data: Record<string, unknown>[];
  type: 'line' | 'bar' | 'pie' | 'donut';
  height?: number;
  className?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ElementType;
  className?: string;
}