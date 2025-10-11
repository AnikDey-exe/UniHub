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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Calendar className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">{APP_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
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

        <div className="flex items-center gap-3">
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
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard" className="w-full">
                    Dashboard
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
    </header>
  );
}
