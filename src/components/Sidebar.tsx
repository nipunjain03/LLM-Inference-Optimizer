"use client";

import React from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";

export function Sidebar() {
  const { clearMessages } = useChat();

  return (
    <aside className="hidden md:flex w-72 flex-shrink-0 p-4 lg:p-6">
      <div className="glass-card edge-highlight animate-rise rounded-3xl flex flex-col h-full w-full p-4 lg:p-5 text-foreground">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Workspace
        </p>
      <Button
        onClick={clearMessages}
        variant="outline"
        className="w-full justify-start gap-2 rounded-2xl bg-primary/20 border-primary/40 text-foreground hover:bg-primary/30 mb-5"
      >
        <MessageSquarePlus size={16} />
        New Chat
      </Button>

      <div className="flex-1 overflow-y-auto soft-scroll rounded-2xl bg-black/25 border border-white/10 p-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Recent Chats
        </h2>
        <div className="space-y-1">
          {/* TODO: Inject dynamically fetched user recent chats here */}
          <p className="text-muted-foreground text-xs p-4 text-center rounded-xl border border-white/8 bg-black/20">
            No recent chats available
          </p>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground leading-relaxed rounded-2xl border border-white/10 bg-black/20 p-3">
        Tip: use Compare to pick a model, then tune generation in Optimize.
      </div>
      </div>
    </aside>
  );
}
