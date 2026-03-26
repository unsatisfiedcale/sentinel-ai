'use client';

import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Key, Copy, Eye, EyeOff, Plus, Trash2, Settings } from 'lucide-react';
import { useState } from 'react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  environment: 'production' | 'development';
  createdAt: string;
  lastUsed: string;
}

const sampleKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sentinel_prod_829374928374928374',
    environment: 'production',
    createdAt: 'Mar 26, 2026',
    lastUsed: '2 hours ago',
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'sentinel_dev_102938475610293847',
    environment: 'development',
    createdAt: 'Mar 20, 2026',
    lastUsed: '5 min ago',
  },
];
export function ProjectsSettings() {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your API keys and project settings</p>
      </div>

      {/* API Keys Section */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base font-semibold text-card-foreground">API Keys</h2>
          </div>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Create Key
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Key</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Environment</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Created</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Last Used</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleKeys.map((apiKey) => (
              <TableRow key={apiKey.id} className="border-border">
                <TableCell className="font-medium text-card-foreground">{apiKey.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-secondary px-2 py-1 text-xs text-muted-foreground">
                      {showKey === apiKey.id ? apiKey.key : apiKey.key.slice(0, 12) + '••••••••••••'}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                    >
                      {showKey === apiKey.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopy(apiKey.key, apiKey.id)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {copied === apiKey.id && <span className="text-xs text-success">Copied!</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      apiKey.environment === 'production'
                        ? 'border-success/30 bg-success/10 text-success'
                        : 'border-info/30 bg-info/10 text-info'
                    }
                  >
                    {apiKey.environment === 'production' ? 'Prod' : 'Dev'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{apiKey.createdAt}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{apiKey.lastUsed}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-error">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* General Settings */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-card-foreground">General Settings</h2>
        </div>

        <div className="grid max-w-md gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input id="projectName" defaultValue="My Application" className="bg-secondary" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alertEmail">Alert Email</Label>
            <Input id="alertEmail" type="email" defaultValue="alerts@company.com" className="bg-secondary" />
          </div>
          <Button className="w-fit">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
