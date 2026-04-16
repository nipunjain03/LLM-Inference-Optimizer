"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Palette, LogOut } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function ProfileDropdown() {
  const { logout, user } = useChat();
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

  const email = user?.email ?? "user@inference.opt";
  const displayName =
    typeof user?.user_metadata?.name === "string"
      ? user.user_metadata.name
      : email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar className="h-9 w-9 border border-zinc-800 transition-opacity hover:opacity-80">
            <AvatarFallback className="bg-indigo-600 text-white text-sm font-medium">
              {initials || "IO"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-zinc-100">
          <div className="px-2 py-1.5">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-zinc-500">
                {email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem
            onClick={() => setShowThemeSwitcher(true)}
            className="cursor-pointer focus:bg-zinc-900 focus:text-zinc-100"
          >
            <Palette className="mr-2 h-4 w-4" />
            <span>Change Theme</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem
            onClick={() => {
              void logout();
            }}
            className="cursor-pointer text-red-400 focus:bg-zinc-900 focus:text-red-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showThemeSwitcher && <ThemeSwitcher onClose={() => setShowThemeSwitcher(false)} />}
    </>
  );
}
