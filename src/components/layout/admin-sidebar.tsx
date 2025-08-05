
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
    <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  (pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href))) ? "bg-muted text-primary" : ""
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            </nav>
          </div>
           <div className="mt-auto p-4">
              <Link
                href="/admin/settings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === "/admin/settings" && "bg-muted text-primary"
                )}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            <Button variant="ghost" className="w-full justify-start px-3 text-muted-foreground">
               <LogOut className="mr-3 h-4 w-4" />
               Logout
            </Button>
          </div>
        </div>
    </aside>
  );
}
