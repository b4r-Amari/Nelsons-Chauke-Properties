
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="inline-flex items-center text-brand-deep hover:text-brand-bright transition-colors font-semibold px-0 hover:bg-transparent"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}
