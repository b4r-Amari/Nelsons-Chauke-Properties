
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="mb-2 text-2xl font-bold font-headline">Something went wrong!</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        An unexpected error occurred while loading this page. Please try again or contact support if the problem persists.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={() => reset()} className="gap-2 bg-brand-bright hover:bg-brand-deep">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <a href="/">Return Home</a>
        </Button>
      </div>
    </div>
  );
}
