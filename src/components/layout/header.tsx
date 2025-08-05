
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, Heart, User, X, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

const propertiesLinks = [
  { href: "/properties", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/properties/sold", label: "Sold" },
  { href: "/properties/on-show", label: "On Show" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        <div className="md:hidden mr-auto">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium font-headline">
          {mainNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative transition-colors hover:text-primary px-3 py-2 rounded-md",
                pathname === link.href ? "text-primary bg-accent/20" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium font-headline",
                pathname.startsWith('/properties') || pathname === '/sell' ? "text-primary bg-accent/20" : "text-muted-foreground",
                "hover:text-primary"
                )}>
                Properties <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {propertiesLinks.map(link => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" aria-label="Wishlist" className="hover:text-red-500">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="User Profile" className="hover:text-primary">
            <User className="h-5 w-5" />
          </Button>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-brand-deep text-white p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 flex justify-between items-center border-b border-white/10">
                    <Logo className="text-white" />
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                         <X className="h-6 w-6"/>
                       </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex-grow p-4">
                    <ul className="space-y-2">
                      {[...mainNavLinks, ...propertiesLinks].map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "block rounded-md px-3 py-2 text-lg font-headline transition-colors",
                              pathname.startsWith(link.href) && link.href !== "/" || pathname === link.href ? "bg-brand-bright" : "hover:bg-white/10"
                            )}
                          >
                            {link.label}
                          </Link>
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
