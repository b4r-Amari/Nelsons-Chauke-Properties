
"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Building, Users, LogOut, Settings, Newspaper } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/properties", label: "Properties", icon: Building },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { toast } = useToast();
  const { user } = useAuth();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out of the portal.",
      });
      
      window.location.href = '/admin/login';
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message || "An error occurred while logging out. Please try again.",
      });
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[220px] flex-col border-r bg-muted/40 md:flex lg:w-[280px]">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarLinks.map((link) => {
              const isActive = (pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href)));
              const label = link.label === "Agents" ? "Estate Agents" : link.label;
              return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive ? "bg-muted text-primary" : ""
                )}
              >
                <link.icon className="h-4 w-4" />
                {label}
              </Link>
            )})}
            </nav>
          </div>
           <div className="mt-auto p-4 border-t border-border space-y-4">
              {user && (
                <div className="px-3 py-2 flex items-center gap-3 bg-background/50 rounded-lg border border-border/50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-brand-deep text-white text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-foreground">{user.email}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Admin</p>
                  </div>
                </div>
              )}
              
              <div className="grid gap-1">
                <Link
                  href="/admin/settings"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary",
                    pathname === "/admin/settings" && "bg-muted text-primary"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Button 
                  variant="ghost" 
                  type="button"
                  className="w-full justify-start px-3 text-muted-foreground hover:bg-destructive hover:text-white transition-all duration-200 group" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                  <span className="group-hover:text-white transition-colors">Logout</span>
                </Button>
              </div>
          </div>
        </div>
    </aside>
  );
}
