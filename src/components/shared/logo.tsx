import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold font-headline", className)}>
      <Home className="h-7 w-7 text-brand-bright" />
      <div>
        <span>NC</span>
        <span className="text-primary">Properties</span>
      </div>
    </Link>
  );
}
