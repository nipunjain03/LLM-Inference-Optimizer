"use client";

import React, { ReactNode } from "react";
import { ChatProvider } from "@/context/ChatContext";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ChatProvider>
  );
}
