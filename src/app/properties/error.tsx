
'use client';

import { Button } from '@/components/ui/button';
import { Home, SearchX } from 'lucide-react';
import Link from 'next/link';

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-24 flex flex-col items-center justify-center text-center">
      <div className="mb-6 bg-muted p-6 rounded-full">
        <SearchX className="h-12 w-12 text-brand-bright" />
      </div>
      <h1 className="text-3xl font-bold font-headline mb-4">Error Loading Properties</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        There was a problem fetching the latest property listings. This might be due to a connection issue or high traffic.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-brand-bright hover:bg-brand-deep">
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
