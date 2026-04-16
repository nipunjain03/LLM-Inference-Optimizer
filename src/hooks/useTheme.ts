import { useEffect, useState } from "react";

export type Theme = "xp";

/**
 * Dynamically load a theme CSS file
 * Removes existing theme CSS and loads the new one
 */
function loadThemeCss(theme: Theme) {
  // Remove existing theme CSS link if it exists
  const existingLink = document.getElementById("theme-css");
  if (existingLink) {
    existingLink.remove();
  }

  // Create and append new theme CSS link
  const link = document.createElement("link");
  link.id = "theme-css";
  link.rel = "stylesheet";
  link.href = `/styles/${theme}.css`;
  document.head.appendChild(link);
}

export function useTheme() {
  const [theme] = useState<Theme>("xp");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage and apply CSS on mount
  useEffect(() => {
    // Load the XP theme by default
    loadThemeCss("xp");
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    // Keep XP theme - no switching needed
  };

  return {
    theme,
    toggleTheme,
    isLoaded,
  };
}
