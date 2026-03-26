'use client';

import { useState } from 'react';
import { Sidebar } from '@/src/components/sentinel/sidebar';
import { DashboardView } from '@/src/components/sentinel/dashboard-view';
import { ProjectView } from '@/src/components/sentinel/project-view';
import { ProjectsSettings } from '@/src/components/sentinel/projects-settings';
import { IntegrationDocs } from '@/src/components/sentinel/integration-docs';
import { ProfileSettings } from '@/src/components/sentinel/profile-settings';
import type { Project } from '@/src/components/sentinel/project-card';

// Sample project data
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Frontend',
    environment: 'production',
    status: 'critical',
    errorCount: 156,
    errorTrend: 23,
    lastError: "TypeError: Cannot read 'map' of undefined",
    uptime: 99.2,
  },
  {
    id: '2',
    name: 'Payment Service',
    environment: 'production',
    status: 'warning',
    errorCount: 45,
    errorTrend: -12,
    lastError: 'NetworkError: Connection timeout',
    uptime: 99.8,
  },
  {
    id: '3',
    name: 'User Auth API',
    environment: 'production',
    status: 'healthy',
    errorCount: 3,
    errorTrend: -67,
    uptime: 99.99,
  },
  {
    id: '4',
    name: 'Analytics Dashboard',
    environment: 'development',
    status: 'healthy',
    errorCount: 12,
    errorTrend: 0,
    uptime: 99.5,
  },
  {
    id: '5',
    name: 'Mobile App Backend',
    environment: 'production',
    status: 'warning',
    errorCount: 28,
    errorTrend: 5,
    lastError: 'RateLimitError: Too many requests',
    uptime: 99.7,
  },
  {
    id: '6',
    name: 'Admin Panel',
    environment: 'development',
    status: 'healthy',
    errorCount: 0,
    errorTrend: 0,
    uptime: 100,
  },
];

export default function SentinelDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToDashboard = () => {
    setSelectedProject(null);
  };

  const renderContent = () => {
    // If a project is selected, show project view regardless of tab
    if (selectedProject && activeTab === 'dashboard') {
      return <ProjectView project={selectedProject} onBack={handleBackToDashboard} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView projects={sampleProjects} onProjectSelect={handleProjectSelect} />;
      case 'projects':
        return <ProjectsSettings />;
      case 'integration':
        return <IntegrationDocs />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <DashboardView projects={sampleProjects} onProjectSelect={handleProjectSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedProject(null);
        }}
      />
      <main className="pl-64">
        <div className="mx-auto max-w-6xl px-8 py-8">{renderContent()}</div>
      </main>
    </div>
  );
}
