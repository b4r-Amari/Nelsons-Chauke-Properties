
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building, Users, LogOut, Settings } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/properties", label: "Properties", icon: Building },
  { href: "/admin/agents", label: "Agents", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
      <div className="mb-8">
        <Logo />
      </div>
      <nav className="flex flex-col gap-2 flex-grow">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              (pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href))) ? "bg-muted text-primary" : ""
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-2">
         <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname === "/admin/settings" && "bg-muted text-primary"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        <Button variant="ghost" className="justify-start px-3 text-muted-foreground">
           <LogOut className="mr-3 h-5 w-5" />
           Logout
        </Button>
      </div>
    </aside>
  );
}
