
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Menu, Heart, User, ChevronDown, LogOut, LayoutDashboard, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth-context";
import { logOut } from "@/lib/firebase/auth";
import { AuthForm } from "@/components/shared/auth-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/", label: "Home" },
  { 
    label: "Properties",
    isDropdown: true,
    links: [
      { href: "/properties", label: "Buy" },
      { href: "/sell", label: "Sell" },
      { href: "/properties/sold", label: "Sold" },
      { href: "/properties/on-show", label: "On Show" },
    ]
  },
  { href: "/blog", label: "Property News" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

const mobileNavLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/properties/sold", label: "Sold" },
  { href: "/properties/on-show", label: "On Show" },
  { href: "/blog", label: "Property News" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
]


export function Header({ setMobileMenuOpen }: { setMobileMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const isPropertiesActive = pathname.startsWith('/properties') || pathname === '/sell';
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const handleMobileMenuToggle = (open: boolean) => {
    setIsMobileMenuOpen(open);
    setMobileMenuOpen(open);
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                            isPropertiesActive ? "text-brand-deep" : "text-muted-foreground hover:text-brand-bright",
                            "focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        )}
                        >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        <span className={cn(
                            'absolute bottom-0 left-0 h-0.5 transition-all duration-300',
                            isPropertiesActive ? 'w-full bg-brand-deep' : 'w-0 group-hover:w-full bg-brand-bright'
                        )}></span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
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
                        pathname === item.href ? "text-brand-deep" : "text-muted-foreground hover:text-brand-bright"
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    >
                    {item.label}
                    <span className={cn(
                        'absolute bottom-0 left-0 h-0.5 transition-all duration-300',
                        pathname === item.href ? 'w-full bg-brand-deep' : 'w-0 group-hover:w-full bg-brand-bright'
                    )}></span>
                    </Link>
                )
                ))}
            </nav>
        </div>

        <div className="ml-auto flex items-center space-x-2">
           <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="View your wishlist" className="text-muted-foreground hover:bg-brand-bright hover:text-white transition-colors"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    setIsAuthDialogOpen(true);
                  }
                }}
              >
                <Link href={user ? "/my-account/wishlist" : "#"} className="w-full h-full flex items-center justify-center">
                  <Heart className="h-12 w-12 md:h-7 md:w-7" />
                </Link>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline text-center">Authentication Required</DialogTitle>
                </DialogHeader>
                <p className="text-center text-muted-foreground">Please sign in or create an account to use the wishlist feature.</p>
                <AuthForm onAuthSuccess={() => setIsAuthDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Open user menu">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`} alt="User avatar" />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/my-account"><LayoutDashboard className="mr-2 h-4 w-4" /> My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-account/wishlist"><Heart className="mr-2 h-4 w-4" /> My Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logOut()}>
                   <LogOut className="mr-2 h-4 w-4" />
                   Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
              <DialogTrigger asChild>
                 <Button variant="ghost" size="icon" aria-label="Login or sign up" className="text-muted-foreground hover:bg-brand-bright hover:text-white transition-colors">
                    <User className="h-12 w-12 md:h-7 md:w-7" />
                  </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline text-center">Welcome</DialogTitle>
                </DialogHeader>
                <AuthForm onAuthSuccess={() => setIsAuthDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}

          <div className="md:hidden">
             <Sheet open={isMobileMenuOpen} onOpenChange={handleMobileMenuToggle}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open mobile menu">
                  <Menu className="h-12 w-12" />
                </Button>
              </SheetTrigger>
               <SheetContent side="left" className="w-full max-w-[320px] bg-background text-foreground p-0" hideClose>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    <div className="flex flex-col h-full">
                        <div className="flex h-20 items-center justify-between border-b px-4">
                            <Logo />
                            <SheetClose className="rounded-md p-2 opacity-70 ring-offset-background transition-all hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:bg-brand-bright hover:text-white">
                                <X className="h-6 w-6" />
                                <span className="sr-only">Close</span>
                            </SheetClose>
                        </div>
                        <nav className="p-4" aria-label="Mobile Navigation">
                            <ul className="space-y-2 w-full">
                            {mobileNavLinks.map((link) => (
                                <li key={link.href}>
                                    <SheetClose asChild>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                        "block rounded-md px-3 py-2 text-lg font-headline transition-colors w-full text-left",
                                        (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)))
                                            ? "bg-muted text-foreground"
                                            : "hover:bg-muted"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                    </SheetClose>
                                </li>
                            ))}
                            </ul>
                        </nav>
                    </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
