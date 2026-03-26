'use client';

import { cn } from '@/src/lib/utils';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  environment: 'production' | 'development';
  status: 'healthy' | 'warning' | 'critical';
  errorCount: number;
  errorTrend: number;
  lastError?: string;
  uptime: number;
}

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    label: 'Healthy',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    label: 'Warning',
  },
  critical: {
    icon: XCircle,
    color: 'text-error',
    bg: 'bg-error/10',
    label: 'Critical',
  },
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const status = statusConfig[project.status];
  const StatusIcon = status.icon;
  const isPositiveTrend = project.errorTrend < 0;

  return (
    <button
      onClick={() => onClick(project)}
      className="group w-full rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-muted-foreground/30 hover:bg-accent/50"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-card-foreground group-hover:text-foreground">{project.name}</h3>
          <span className="mt-1 inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {project.environment === 'production' ? 'Prod' : 'Dev'}
          </span>
        </div>
        <div className={cn('rounded-lg p-2', status.bg)}>
          <StatusIcon className={cn('h-5 w-5', status.color)} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Errors (24h)</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-semibold tabular-nums text-card-foreground">{project.errorCount}</span>
            {project.errorTrend !== 0 && (
              <span
                className={cn('flex items-center text-xs font-medium', isPositiveTrend ? 'text-success' : 'text-error')}
              >
                {isPositiveTrend ? (
                  <TrendingDown className="mr-0.5 h-3 w-3" />
                ) : (
                  <TrendingUp className="mr-0.5 h-3 w-3" />
                )}
                {Math.abs(project.errorTrend)}%
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Uptime</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-card-foreground">{project.uptime}%</p>
        </div>
      </div>

      {/* Last error preview */}
      {project.lastError && (
        <div className="mt-4 border-t border-border pt-3">
          <p className="truncate text-xs text-muted-foreground">
            Latest: <span className="text-error">{project.lastError}</span>
          </p>
        </div>
      )}
    </button>
  );
}
