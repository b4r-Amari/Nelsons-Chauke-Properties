
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-8 rounded-full bg-muted p-6">
        <Home className="h-16 w-16 text-brand-bright" />
      </div>
      <h1 className="font-headline text-6xl font-bold text-brand-deep">404</h1>
      <h2 className="mt-4 font-headline text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        The property or page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button asChild variant="outline" className="gap-2">
          <button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </Button>
        <Button asChild className="bg-brand-bright hover:bg-brand-deep">
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
