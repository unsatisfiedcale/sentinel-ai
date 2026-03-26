'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { ErrorTable, ErrorGroup } from './error-table';
import { SolutionDrawer } from './solution-drawer';
import type { Project } from './project-card';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
}

// Sample error data
const sampleErrors: ErrorGroup[] = [
  {
    id: '1',
    type: 'TypeError',
    message: "Cannot read properties of undefined (reading 'map')",
    count: 156,
    firstSeen: '2 days ago',
    lastSeen: '5 min ago',
    environment: 'production',
    severity: 'critical',
    stackPreview: `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (src/components/UserList.tsx:42:18)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:17811:13)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:19049:16)
    at HTMLUnknownElement.callCallback (node_modules/react-dom/cjs/react-dom.development.js:3945:14)`,
  },
  {
    id: '2',
    type: 'ReferenceError',
    message: 'process is not defined',
    count: 89,
    firstSeen: '1 week ago',
    lastSeen: '1 hour ago',
    environment: 'production',
    severity: 'high',
    stackPreview: `ReferenceError: process is not defined
    at Module.../config.js (config.js:1:1)
    at __webpack_require__ (bootstrap:84:1)
    at Module.../pages/_app.js (_app.js:1:1)
    at __webpack_require__ (bootstrap:84:1)`,
  },
  {
    id: '3',
    type: 'NetworkError',
    message: 'Failed to fetch: /api/users',
    count: 45,
    firstSeen: '3 days ago',
    lastSeen: '30 min ago',
    environment: 'production',
    severity: 'medium',
    stackPreview: `NetworkError: Failed to fetch
    at fetchUsers (src/api/users.ts:15:10)
    at async UserDashboard (src/pages/dashboard.tsx:23:5)`,
  },
  {
    id: '4',
    type: 'SyntaxError',
    message: 'Unexpected token < in JSON at position 0',
    count: 23,
    firstSeen: '5 days ago',
    lastSeen: '2 hours ago',
    environment: 'development',
    severity: 'low',
    stackPreview: `SyntaxError: Unexpected token < in JSON at position 0
    at JSON.parse (<anonymous>)
    at parseJSON (src/utils/api.ts:45:12)
    at processResponse (src/utils/api.ts:28:10)`,
  },
  {
    id: '5',
    type: 'ChunkLoadError',
    message: 'Loading chunk 5 failed',
    count: 12,
    firstSeen: '1 day ago',
    lastSeen: '4 hours ago',
    environment: 'production',
    severity: 'medium',
    stackPreview: `ChunkLoadError: Loading chunk 5 failed.
    at __webpack_require__.f.j (webpack/runtime/chunk loaded:27:1)
    at ensure (webpack/runtime/ensure chunk:25:1)
    at loadComponent (src/routes/lazy.tsx:12:5)`,
  },
];

export function ProjectView({ project, onBack }: ProjectViewProps) {
  const [selectedEnvironment, setSelectedEnvironment] = useState<'all' | 'production' | 'development'>('all');
  const [selectedError, setSelectedError] = useState<ErrorGroup | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleErrorSelect = (error: ErrorGroup) => {
    setSelectedError(error);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{project.name}</h1>
              <Badge variant="secondary">{project.environment === 'production' ? 'Production' : 'Development'}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">View and analyze errors for this project</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-muted-foreground">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Error Table */}
      <ErrorTable
        errors={sampleErrors}
        onErrorSelect={handleErrorSelect}
        selectedEnvironment={selectedEnvironment}
        onEnvironmentChange={setSelectedEnvironment}
      />

      {/* Solution Drawer */}
      <SolutionDrawer error={selectedError} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
