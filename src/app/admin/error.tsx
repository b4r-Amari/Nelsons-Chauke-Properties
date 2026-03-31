
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Error:', error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-6 dark:bg-red-900/20">
        <ShieldAlert className="h-16 w-16 text-red-600" />
      </div>
      <h1 className="mb-4 text-3xl font-bold font-headline">Portal Error</h1>
      <p className="mb-8 max-w-lg text-muted-foreground">
        We encountered an error while trying to load the administrative interface. Your session is safe, but the requested action could not be completed.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} size="lg" className="bg-brand-bright hover:bg-brand-deep">
          <RefreshCw className="mr-2 h-5 w-5" />
          Retry Operation
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/admin/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
