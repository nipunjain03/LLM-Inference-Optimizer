"use client";

import React from "react";
import { useChat } from "@/context/ChatContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

export function ProfileDropdown() {
  const { logout, user } = useChat();

  const email = user?.email ?? "user@inference.opt";
  const displayName =
    typeof user?.user_metadata?.name === "string"
      ? user.user_metadata.name
      : email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 border border-white/15 bg-black/30 transition-all hover:opacity-85">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
            {initials || "IO"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-[#06162d] border-white/12 text-zinc-100 rounded-xl">
        <div className="px-3 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-zinc-400">
              {email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={() => {
            void logout();
          }}
          className="cursor-pointer text-red-300 focus:bg-red-950/50 focus:text-red-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
