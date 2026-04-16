"use client";

import React, { ReactNode } from "react";
import { ChatProvider } from "@/context/ChatContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ChatProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </ChatProvider>
    </ThemeProvider>
  );
}
