'use client';

import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Copy, Check, Terminal, FileCode, Package, Zap } from 'lucide-react';
import { useState } from 'react';

const codeSnippets = {
  install: `npm install @sentinel-ai/sdk`,
  init: `import { SentinelAI } from '@sentinel-ai/sdk';

// Initialize the SDK
const sentinel = new SentinelAI({
  apiKey: process.env.SENTINEL_API_KEY,
  environment: process.env.NODE_ENV,
});

// Initialize error tracking
sentinel.init();`,
  nextjs: `// app/layout.tsx
import { SentinelAI } from '@sentinel-ai/sdk';

if (process.env.SENTINEL_API_KEY) {
  SentinelAI.init({
    apiKey: process.env.SENTINEL_API_KEY,
    environment: process.env.NODE_ENV,
    // Optional: capture additional context
    beforeSend: (error) => {
      // Modify or filter errors before sending
      return error;
    },
  });
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}`,
  express: `// server.js
import express from 'express';
import { SentinelAI } from '@sentinel-ai/sdk';

const app = express();

// Initialize SentinelAI
SentinelAI.init({
  apiKey: process.env.SENTINEL_API_KEY,
  environment: process.env.NODE_ENV,
});

// Your routes here
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Error handling middleware (must be last)
app.use(SentinelAI.errorHandler());

app.listen(3000);`,
  manual: `import { SentinelAI } from '@sentinel-ai/sdk';

try {
  // Your code that might throw
  await riskyOperation();
} catch (error) {
  // Manually capture errors
  SentinelAI.captureException(error, {
    tags: {
      feature: 'checkout',
      priority: 'high',
    },
    user: {
      id: currentUser.id,
      email: currentUser.email,
    },
  });
}`,
};

export function IntegrationDocs() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, id, language = 'typescript' }: { code: string; id: string; language?: string }) => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-8 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => handleCopy(code, id)}
      >
        {copied === id ? (
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
      <pre className="overflow-x-auto rounded-lg bg-secondary p-4 text-xs leading-relaxed text-card-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Integration</h1>
        <p className="mt-1 text-sm text-muted-foreground">Set up SentinelAI SDK in your application</p>
      </div>

      {/* Quick Start */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-warning" />
          <h2 className="text-base font-semibold text-card-foreground">Quick Start</h2>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Step 1
              </Badge>
              <span className="text-sm text-muted-foreground">Install the SDK</span>
            </div>
            <CodeBlock code={codeSnippets.install} id="install" />
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Step 2
              </Badge>
              <span className="text-sm text-muted-foreground">Initialize in your app</span>
            </div>
            <CodeBlock code={codeSnippets.init} id="init" />
          </div>
        </div>
      </div>

      {/* Framework-specific guides */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-base font-semibold text-card-foreground">Framework Guides</h2>
          </div>
        </div>

        <Tabs defaultValue="nextjs" className="p-5">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary">
            <TabsTrigger value="nextjs" className="data-[state=active]:bg-accent">
              Next.js
            </TabsTrigger>
            <TabsTrigger value="express" className="data-[state=active]:bg-accent">
              Express
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-accent">
              Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nextjs" className="mt-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Add SentinelAI to your Next.js application&apos;s root layout:
            </p>
            <CodeBlock code={codeSnippets.nextjs} id="nextjs" />
          </TabsContent>

          <TabsContent value="express" className="mt-4">
            <p className="mb-4 text-sm text-muted-foreground">Set up error handling in your Express server:</p>
            <CodeBlock code={codeSnippets.express} id="express" />
          </TabsContent>

          <TabsContent value="manual" className="mt-4">
            <p className="mb-4 text-sm text-muted-foreground">Manually capture errors with additional context:</p>
            <CodeBlock code={codeSnippets.manual} id="manual" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Terminal,
            title: 'Automatic Capture',
            description: 'Automatically captures unhandled exceptions and promise rejections',
          },
          {
            icon: Package,
            title: 'Source Maps',
            description: 'Upload source maps for readable stack traces in production',
          },
          {
            icon: Zap,
            title: 'AI Analysis',
            description: 'Every error is analyzed by AI to provide instant solutions',
          },
        ].map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
