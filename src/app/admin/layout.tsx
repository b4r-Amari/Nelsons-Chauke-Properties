
"use client";

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { ThemeProvider } from '@/context/theme-provider';
import { cn } from '@/lib/utils';
import '../globals.css';

// Metadata is now defined in the parent layout, so this is not needed here.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="admin-ui-theme">
        <AuthProvider>
            <div className="relative flex min-h-screen w-full bg-background">
                {!isLoginPage && <AdminSidebar />}
                <main className={cn(
                "flex-1",
                !isLoginPage && "p-4 sm:p-6 md:p-8 md:ml-[220px] lg:ml-[280px]"
                )}>
                {children}
                </main>
            </div>
            <Toaster />
        </AuthProvider>
    </ThemeProvider>
  );
}
