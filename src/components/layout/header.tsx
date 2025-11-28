
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { 
    label: "Properties",
    isDropdown: true,
    links: [
      { href: "/properties", label: "Buy" },
      { href: "/sell", label: "Sell" },
      { href: "/properties/on-show", label: "On Show" },
    ]
  },
  { href: "/calculators", label: "Calculators" },
  { href: "/blog", label: "Property News" },
];

const mobileNavLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/properties/on-show", label: "On Show" },
  { href: "/calculators", label: "Calculators" },
  { href: "/blog", label: "Property News" },
]


export function Header({ setMobileMenuOpen }: { setMobileMenuOpen: Dispatch<SetStateAction<boolean>> }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPropertiesActive = pathname.startsWith('/properties') || pathname === '/sell';
  const isCalculatorsActive = pathname.startsWith('/calculators');
  
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
                         (pathname === item.href || (isCalculatorsActive && item.label === 'Calculators')) ? 'w-full bg-brand-deep' : 'w-0 group-hover:w-full bg-brand-bright'
                    )}></span>
                    </Link>
                )
                ))}
            </nav>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {/*
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Open user menu">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`} alt="User avatar" />
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
                <DropdownMenuItem onClick={() => logOut()}>
                   <LogOut className="mr-2 h-4 w-4" />
                   Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
          */}

          <div className="md:hidden">
             <Sheet open={isMobileMenuOpen} onOpenChange={handleMobileMenuToggle}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open mobile menu" className="h-16 w-16">
                  <Menu className="h-12 w-12" />
                </Button>
              </SheetTrigger>
               <SheetContent side="left" className="w-full max-w-[320px] bg-background text-foreground p-0">
                    <SheetHeader className="flex flex-row h-20 items-center justify-between border-b px-4">
                        <Logo />
                         <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">
                            A list of links to navigate the NC Properties website.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col h-full">
                        <nav className="p-4" aria-label="Mobile Navigation">
                            <ul className="space-y-2 w-full">
                            {mobileNavLinks.map((link) => (
                                <li key={link.href || link.label}>
                                    <SheetClose asChild>
                                    <Link
                                        href={link.href || '#'}
                                        className={cn(
                                        "block rounded-md px-3 py-2 text-lg font-headline transition-colors w-full text-left",
                                        (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href || '')) && !link.isDropdown)
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

    