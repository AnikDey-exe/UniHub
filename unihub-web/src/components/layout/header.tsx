"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { useCurrentUser } from "@/context/user-context";

export function Header() {
  const { user, isLoading, isError } = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full pt-3 pb-3 px-4 md:pt-4 md:pb-4 md:px-6">
      {/* Desktop: centered capsule navbar */}
      <div className="hidden md:flex md:justify-center">
        <div className="w-full max-w-4xl rounded-full bg-white shadow-[0_2px_12px_4px_rgba(0,0,0,0.08),0_0_2px_rgba(0,0,0,0.06)] px-6 py-2 min-h-[3.5rem] flex items-center">
          <div className="grid grid-cols-3 w-full items-center">
            {/* Left side - Logo */}
            <div className="flex justify-start">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo-no-bg.png"
                  alt={`${APP_NAME} logo`}
                  width={90}
                  height={90}
                  className="h-9 w-9 object-cover"
                />
                <span className="text-xl font-bold text-foreground">{APP_NAME}</span>
              </Link>
            </div>

            {/* Center - Navigation */}
            <nav className="flex items-center justify-center gap-6">
              <Link
                href="/events"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Events
              </Link>
              <Link
                href="/colleges"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Colleges
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
                    <Link href="/create-event" className="w-full">
                      Create Event
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profile
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
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden rounded-full bg-white shadow-[0_2px_12px_4px_rgba(0,0,0,0.08),0_0_2px_rgba(0,0,0,0.06)] px-4">
        <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-no-bg.png"
                alt={`${APP_NAME} logo`}
                width={32}
                height={32}
                className="h-8 w-8 object-cover"
              />
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
                      <Link href="/create-event" className="w-full">
                        Create Event
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full">
                        Profile
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
                      Events
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/colleges" className="w-full">
                      Colleges
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Link href="/about" className="w-full">
                      About
                    </Link>
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
      </div>
    </header>
  );
}
