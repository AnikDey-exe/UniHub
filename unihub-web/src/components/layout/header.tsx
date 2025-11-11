"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Menu, User } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { useCurrentUser } from "@/context/user-context";

export function Header() {
  const { user, isLoading, isError } = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-16 px-4 md:px-6">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 h-full items-center">
          {/* Left side - Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">{APP_NAME}</span>
            </Link>
          </div>

          {/* Center - Navigation */}
          <nav className="flex items-center justify-center gap-6">
            <Link
              href="/events"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Browse Events
            </Link>
            <Link
              href="/colleges"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Colleges
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right side - Auth buttons */}
          <div className="flex items-center justify-end gap-3">
            {!user ? (
              <>
                <Button variant="ghost" size="sm">
                  <Link
                    href="/login"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Log in
                  </Link>
                </Button>
                <Button size="sm">
                  <Link
                    href="/signup"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Sign up
                  </Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user.firstName} {user.lastName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/my-events" className="w-full">
                      My Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">{APP_NAME}</span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {!user ? (
                <>
                  <Button variant="ghost" size="sm" className="px-2">
                    <Link
                      href="/login"
                      className="text-xs font-medium hover:text-primary transition-colors"
                    >
                      Log in
                    </Link>
                  </Button>
                  <Button size="sm" className="px-3 text-xs">
                    <Link
                      href="/signup"
                      className="font-medium hover:text-primary transition-colors"
                    >
                      Sign up
                    </Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <User className="h-4 w-4" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/my-events" className="w-full">
                        My Events
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/settings" className="w-full">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* Mobile Menu Toggle */}
              <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/events" className="w-full">
                      Browse Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/colleges" className="w-full">
                      Colleges
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/about" className="w-full">
                      About
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
