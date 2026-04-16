"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { AuthModal } from "./AuthModal";
import { ProfileDropdown } from "./ProfileDropdown";

export function Navbar() {
  const { isAuthenticated, isAuthLoading } = useChat();
  const pathname = usePathname();

  const activeClass = "px-4 py-2 text-sm font-medium text-foreground bg-secondary retro-bevel-inset transition-colors";
  const inactiveClass = "px-4 py-2 text-sm font-medium text-foreground bg-card retro-bevel hover:bg-secondary transition-colors";

  return (
    <nav className="h-16 w-full bg-card retro-bevel flex items-center justify-between px-6 shrink-0 z-50">
      {/* Left: Logo + Branding */}
      <div className="flex items-center gap-2 group px-2 py-1 cursor-pointer transition-all">
        <Image 
          src="/logo.png" 
          alt="Optimus Logo" 
          width={32}
          height={32}
          className="transition-all group-hover:opacity-70" 
          priority
        />
        <span className="text-foreground font-semibold text-lg tracking-tight transition-colors group-hover:text-primary !font-sans">
          Optimus
        </span>
      </div>

      {/* Center: Tabs */}
      <div className="hidden md:flex items-center space-x-1">
        <Link href="/" className={pathname === "/" ? activeClass : inactiveClass}>
          Chat
        </Link>
        <Link href="/compare" className={pathname === "/compare" ? activeClass : inactiveClass}>
          Compare Models
        </Link>
        <Link href="/optimize" className={pathname === "/optimize" ? activeClass : inactiveClass}>
          Optimize
        </Link>
      </div>

      {/* Right: Auth Controls */}
      <div className="flex items-center gap-4">
        {isAuthLoading ? (
          <span className="inline-flex items-center justify-center text-sm font-bold bg-card retro-bevel text-foreground px-6 py-2 opacity-60">
            Loading...
          </span>
        ) : isAuthenticated ? (
          <ProfileDropdown />
        ) : (
          <AuthModal />
        )}
      </div>
    </nav>
  );
}
