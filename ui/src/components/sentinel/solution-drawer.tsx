'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/src/components/ui/sheet';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { cn } from '@/src/lib/utils';
import { Sparkles, Copy, Check, Clock, AlertTriangle, FileCode, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { ErrorGroup } from './error-table';

interface SolutionDrawerProps {
  error: ErrorGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Simulated AI solution data
const getAISolution = (error: ErrorGroup | null) => {
  if (!error) return null;

  return {
    summary:
      "This error occurs when attempting to access a property on an undefined object. The root cause is likely an asynchronous data fetch that hasn't completed before the component renders.",
    solution: `// Before (problematic code)
const userName = user.profile.name;

// After (fixed code)
const userName = user?.profile?.name ?? 'Unknown User';

// Alternative: Add null check
if (user && user.profile) {
  const userName = user.profile.name;
}`,
    explanation: [
      'The error originates from line 42 in UserProfile.tsx where user.profile is accessed without null checking.',
      'This happens because the user data is fetched asynchronously but the component renders before the data arrives.',
      'Using optional chaining (?.) prevents the error by safely accessing nested properties.',
    ],
    preventionTips: [
      'Always use optional chaining when accessing nested object properties',
      'Implement loading states for async data',
      'Add TypeScript strict null checks to catch these issues at compile time',
    ],
    relatedDocs: [
      { title: 'Optional Chaining', url: '#' },
      { title: 'Async Data Patterns', url: '#' },
    ],
  };
};

export function SolutionDrawer({ error, open, onOpenChange }: SolutionDrawerProps) {
  const [copied, setCopied] = useState(false);
  const solution = getAISolution(error);

  const handleCopy = () => {
    if (solution) {
      navigator.clipboard.writeText(solution.solution);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!error || !solution) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-border bg-card sm:max-w-xl">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-error/10 p-2">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg font-semibold text-card-foreground">{error.type}</SheetTitle>
              <SheetDescription className="mt-1 text-sm text-muted-foreground">{error.message}</SheetDescription>
            </div>
          </div>

          {/* Meta info */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn(
                'capitalize',
                error.severity === 'critical' || error.severity === 'high'
                  ? 'border-error/30 bg-error/10 text-error'
                  : error.severity === 'medium'
                    ? 'border-warning/30 bg-warning/10 text-warning'
                    : 'border-info/30 bg-info/10 text-info'
              )}
            >
              {error.severity}
            </Badge>
            <Badge variant="secondary">{error.environment === 'production' ? 'Production' : 'Development'}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {error.count} occurrences
            </Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <Tabs defaultValue="solution" className="mt-4">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="solution" className="data-[state=active]:bg-accent">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Solution
              </TabsTrigger>
              <TabsTrigger value="stacktrace" className="data-[state=active]:bg-accent">
                <FileCode className="mr-2 h-4 w-4" />
                Stack Trace
              </TabsTrigger>
            </TabsList>

            <TabsContent value="solution" className="mt-4 space-y-6">
              {/* AI Summary */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-info" />
                  <h3 className="text-sm font-semibold text-card-foreground">AI Analysis</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{solution.summary}</p>
              </div>

              {/* Code Solution */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-success" />
                    <h3 className="text-sm font-semibold text-card-foreground">Suggested Fix</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 text-xs">
                    {copied ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg bg-secondary p-4 text-xs leading-relaxed text-card-foreground">
                  <code>{solution.solution}</code>
                </pre>
              </div>

              {/* Explanation */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <h3 className="text-sm font-semibold text-card-foreground">Explanation</h3>
                </div>
                <ul className="space-y-2">
                  {solution.explanation.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention Tips */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-card-foreground">Prevention Tips</h3>
                <div className="space-y-2">
                  {solution.preventionTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stacktrace" className="mt-4">
              <pre className="overflow-x-auto rounded-lg bg-secondary p-4 text-xs leading-relaxed text-error">
                <code>{error.stackPreview}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
