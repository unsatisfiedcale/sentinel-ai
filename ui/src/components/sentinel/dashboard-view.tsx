'use client'

import { Project, ProjectCard } from './project-card'
import { Activity, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react'

interface DashboardViewProps {
  projects: Project[]
  onProjectSelect: (project: Project) => void
}

export function DashboardView({ projects, onProjectSelect }: DashboardViewProps) {
  const totalErrors = projects.reduce((sum, p) => sum + p.errorCount, 0)
  const criticalCount = projects.filter((p) => p.status === 'critical').length
  const healthyCount = projects.filter((p) => p.status === 'healthy').length
  const avgUptime =
    projects.reduce((sum, p) => sum + p.uptime, 0) / projects.length

  const metrics = [
    {
      label: 'Total Errors (24h)',
      value: totalErrors,
      icon: AlertTriangle,
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
    {
      label: 'Critical Projects',
      value: criticalCount,
      icon: Activity,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Healthy Projects',
      value: healthyCount,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Avg. Uptime',
      value: `${avgUptime.toFixed(1)}%`,
      icon: TrendingDown,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your application health and track errors in real-time
        </p>
      </div>

      {/* Global Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${metric.bgColor}`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-semibold tabular-nums text-card-foreground">
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Projects Grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Projects</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={onProjectSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
