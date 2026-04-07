
"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  ChevronDown, 
  Home, 
  Building, 
  Handshake, 
  Eye, 
  Calculator, 
  Newspaper, 
  Users, 
  Mail, 
  LogOut,
  X,
  User,
  LayoutDashboard
} from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navLinks = [
  { href: "/", label: "Home" },
  { 
    label: "Properties",
    isDropdown: true,
    links: [
      { href: "/properties", label: "Buy" },
      { href: "/sell", label: "Sell" },
      { href: "/properties/on-show", label: "On Show" },
      { href: "/about-us#team", label: "Our Team" },
    ]
  },
  { href: "/calculators", label: "Calculators" },
  { href: "/blog", label: "Property News" },
];

const mobileNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Buy", icon: Building },
  { href: "/sell", label: "Sell", icon: Handshake },
  { href: "/properties/on-show", label: "On Show", icon: Eye },
  { href: "/calculators", label: "Calculators", icon: Calculator },
  { href: "/blog", label: "Property News", icon: Newspaper },
  { href: "/about-us", label: "Our Team", icon: Users },
]


export function Header({ setMobileMenuOpen }: { setMobileMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, isLoading } = useAuth();
  const supabase = createClient();

  const isPropertiesActive = pathname.startsWith('/properties') || pathname === '/sell';
  const isCalculatorsActive = pathname.startsWith('/calculators');
  
  const handleMobileMenuToggle = (open: boolean) => {
    setIsMobileMenuOpen(open);
    setMobileMenuOpen(open);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    handleMobileMenuToggle(false);
    router.push('/');
    router.refresh();
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-20 items-center">
        <div className="mr-4 flex items-center">
          <Logo />
        </div>
        
        <div className="hidden md:flex md:flex-1 items-center justify-center">
            <nav className="flex items-center space-x-1 text-sm font-medium font-headline" aria-label="Main Navigation">
                {navLinks.map((item) => (
                item.isDropdown && item.links ? (
                    <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                        <Button 
                        variant="ghost" 
                        className={cn(
                            "group relative px-3 py-2 text-sm font-medium font-headline transition-colors hover:bg-transparent",
                            (isPropertiesActive && item.label === 'Properties') ? "text-brand-deep" : "text-muted-foreground hover:text-brand-bright",
                            "focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        )}
                        >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        <span className={cn(
                            'absolute bottom-0 left-0 h-0.5 transition-all duration-300',
                            (isPropertiesActive && item.label === 'Properties') ? 'w-full bg-brand-deep' : 'w-0 group-hover:w-full bg-brand-bright'
                        )}></span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        {item.links.map(link => (
                        <DropdownMenuItem key={link.href} asChild>
                            <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link
                    key={item.href}
                    href={item.href!}
                    className={cn(
                        "group relative transition-colors px-3 py-2 hover:bg-transparent",
                        (pathname === item.href || (isCalculatorsActive && item.label === 'Calculators')) ? "text-brand-deep" : "text-muted-foreground hover:text-brand-bright"
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    >
                    {item.label}
                    <span className={cn(
                        'absolute bottom-0 left-0 h-0.5 transition-all duration-300',
                         (pathname === item.href || (isCalculatorsActive && item.label === 'Calculators')) ? "text-brand-deep" : "text-muted-foreground hover:text-brand-bright"
                    )}></span>
                    </Link>
                )
                ))}
            </nav>
        </div>

        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center">
            {isLoading ? (
              <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-brand-bright/20">
                      <AvatarFallback className="bg-brand-bright text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Account</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer font-bold text-brand-bright">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Portal</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-brand-bright hover:bg-brand-deep text-white">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          <div className="md:hidden">
             <Sheet open={isMobileMenuOpen} onOpenChange={handleMobileMenuToggle}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open mobile menu" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
               <SheetContent side="left" className="w-full max-w-[320px] bg-background text-foreground p-0 flex flex-col">
                    <SheetHeader className="flex flex-row h-20 items-center justify-between border-b px-6 shrink-0">
                        <Logo />
                        <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">
                            A list of links to navigate the NC Properties website.
                        </SheetDescription>
                    </SheetHeader>
                    
                    <div className="flex-1 overflow-y-auto py-6 px-4">
                        <nav aria-label="Mobile Navigation">
                            <ul className="space-y-4">
                            {mobileNavLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                        "flex items-center gap-4 rounded-lg px-4 py-2.5 text-base font-medium transition-colors w-full",
                                        (pathname === link.href)
                                            ? "text-brand-bright bg-muted/50"
                                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                                        )}
                                        onClick={() => handleMobileMenuToggle(false)}
                                    >
                                        <link.icon className="h-5 w-5 shrink-0" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="mt-auto border-t p-6 shrink-0 space-y-4">
                        {user && (
                          <div className="grid gap-2">
                             {isAdmin && (
                                <Button asChild variant="outline" className="w-full justify-start border-brand-bright text-brand-bright" onClick={() => handleMobileMenuToggle(false)}>
                                  <Link href="/admin/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Admin Portal
                                  </Link>
                                </Button>
                             )}
                             <Button onClick={handleLogout} variant="destructive" className="w-full justify-start">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                             </Button>
                          </div>
                        )}
                        
                        <Link
                            href="/contact-us"
                            className={cn(
                                "flex items-center gap-4 px-4 py-2.5 w-full text-base font-medium transition-colors rounded-lg",
                                pathname === "/contact-us" 
                                    ? "text-brand-bright bg-muted/50" 
                                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                            )}
                            onClick={() => handleMobileMenuToggle(false)}
                        >
                            <Mail className="h-5 w-5 shrink-0" />
                            Contact Us
                        </Link>
                    </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
