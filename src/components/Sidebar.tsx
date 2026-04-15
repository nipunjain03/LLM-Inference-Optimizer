"use client";

import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";

export function Sidebar() {
  const { clearMessages } = useChat();

  return (
    <div className="flex flex-col h-full bg-card retro-bevel p-4 w-64 flex-shrink-0 text-foreground hidden md:flex">
      <Button
        onClick={clearMessages}
        variant="outline"
        className="w-full justify-start gap-2 bg-card border-none retro-bevel hover:retro-bevel-inset text-foreground mb-6"
      >
        <MessageSquarePlus size={16} />
        New Chat
      </Button>

      <div className="flex-1 overflow-y-auto bg-input retro-bevel-inset p-2">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Recent Chats
        </h2>
        <div className="space-y-1">
          {/* TODO: Inject dynamically fetched user recent chats here */}
          <p className="text-muted-foreground text-xs p-2 text-center">No recent chats available</p>
        </div>
      </div>

    </div>
  );
}
