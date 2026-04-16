"use client";

import React, { ReactNode, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isLoaded } = useTheme();

  // Only render when theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
}
