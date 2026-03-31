
'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background text-foreground antialiased">
        <h2 className="mb-4 text-3xl font-bold font-headline">A critical error occurred!</h2>
        <p className="mb-8 text-muted-foreground">The application root encountered a fatal error and needs to restart.</p>
        <Button onClick={() => reset()} size="lg" className="bg-brand-bright">
          Attempt Recovery
        </Button>
      </body>
    </html>
  );
}
