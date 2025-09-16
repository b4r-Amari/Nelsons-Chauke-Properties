
"use client";

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/auth-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { Toaster } from '@/components/ui/toaster';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { ThemeProvider } from '@/context/theme-provider';
import { cn } from '@/lib/utils';
import '../globals.css';

// This metadata is not used in a client component, but we keep it for reference
// export const metadata: Metadata = {
//   title: 'Admin - NC Properties',
//   description: 'Admin portal for NC Properties.',
// };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <WishlistProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="admin-ui-theme">
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
            </ThemeProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
