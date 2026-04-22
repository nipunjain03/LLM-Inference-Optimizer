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

  const activeClass = "rounded-full bg-primary/22 text-foreground px-4 py-2 text-sm font-semibold border border-primary/50 shadow-[0_0_0_1px_rgba(25,167,206,0.22)]";
  const inactiveClass = "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/6 border border-transparent transition-all";

  return (
    <nav className="h-18 w-full shrink-0 z-50 px-4 md:px-6 py-3 border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="glass-card edge-highlight h-full rounded-2xl px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer transition-all">
          <Image
            src="/logo.png"
            alt="Optimus Logo"
            width={32}
            height={32}
            className="transition-all group-hover:scale-105"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="text-foreground font-semibold text-lg tracking-tight">
              Optimus
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Inference Studio
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-black/20 rounded-full px-2 py-1 border border-white/10">
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

        <div className="flex items-center gap-3">
          {isAuthLoading ? (
            <span className="inline-flex items-center justify-center text-xs font-medium text-muted-foreground px-4 py-2 rounded-full bg-black/20 border border-white/10">
              Loading...
            </span>
          ) : isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <AuthModal />
          )}
        </div>
      </div>

      <div className="md:hidden mt-3 overflow-x-auto soft-scroll">
        <div className="inline-flex min-w-full items-center gap-2 bg-black/25 rounded-2xl p-1 border border-white/10">
          <Link href="/" className={`flex-1 text-center ${pathname === "/" ? activeClass : inactiveClass}`}>
            Chat
          </Link>
          <Link href="/compare" className={`flex-1 text-center ${pathname === "/compare" ? activeClass : inactiveClass}`}>
            Compare
          </Link>
          <Link href="/optimize" className={`flex-1 text-center ${pathname === "/optimize" ? activeClass : inactiveClass}`}>
            Optimize
          </Link>
        </div>
      </div>
    </nav>
  );
}
