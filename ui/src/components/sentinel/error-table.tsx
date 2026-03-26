'use client';

import { cn } from '@/src/lib/utils';
import { Badge } from '@/src/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { AlertCircle, ChevronRight } from 'lucide-react';

export interface ErrorGroup {
  id: string;
  type: string;
  message: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  environment: 'production' | 'development';
  severity: 'low' | 'medium' | 'high' | 'critical';
  stackPreview: string;
}

interface ErrorTableProps {
  errors: ErrorGroup[];
  onErrorSelect: (error: ErrorGroup) => void;
  selectedEnvironment: 'all' | 'production' | 'development';
  onEnvironmentChange: (env: 'all' | 'production' | 'development') => void;
}

const severityConfig = {
  low: { color: 'bg-info/20 text-info border-info/30' },
  medium: { color: 'bg-warning/20 text-warning border-warning/30' },
  high: { color: 'bg-error/20 text-error border-error/30' },
  critical: { color: 'bg-error/30 text-error border-error/50' },
};

export function ErrorTable({ errors, onErrorSelect, selectedEnvironment, onEnvironmentChange }: ErrorTableProps) {
  const filteredErrors =
    selectedEnvironment === 'all' ? errors : errors.filter((e) => e.environment === selectedEnvironment);

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header with filters */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-card-foreground">Error Groups</h2>
          <Badge variant="secondary" className="ml-2">
            {filteredErrors.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          {(['all', 'production', 'development'] as const).map((env) => (
            <button
              key={env}
              onClick={() => onEnvironmentChange(env)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                selectedEnvironment === env
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {env === 'all' ? 'All' : env === 'production' ? 'Prod' : 'Dev'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-xs font-medium text-muted-foreground">Error</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Count</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Severity</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Environment</TableHead>
            <TableHead className="text-xs font-medium text-muted-foreground">Last Seen</TableHead>
            <TableHead className="w-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredErrors.map((error) => (
            <TableRow
              key={error.id}
              onClick={() => onErrorSelect(error)}
              className="cursor-pointer border-border transition-colors hover:bg-accent/50"
            >
              <TableCell className="max-w-xs">
                <div>
                  <p className="font-medium text-card-foreground">{error.type}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{error.message}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-lg font-semibold tabular-nums text-card-foreground">{error.count}</span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn('capitalize', severityConfig[error.severity].color)}>
                  {error.severity}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {error.environment === 'production' ? 'Prod' : 'Dev'}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{error.lastSeen}</TableCell>
              <TableCell>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredErrors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-success/10 p-3">
            <AlertCircle className="h-6 w-6 text-success" />
          </div>
          <p className="mt-3 text-sm font-medium text-card-foreground">No errors found</p>
          <p className="mt-1 text-xs text-muted-foreground">Your application is running smoothly</p>
        </div>
      )}
    </div>
  );
}
