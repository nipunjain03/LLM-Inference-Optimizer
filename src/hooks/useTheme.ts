import { useEffect, useState } from "react";

export type Theme = "xp" | "modern";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("xp");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || "xp";
    
    // Apply theme to DOM immediately
    document.documentElement.classList.remove("xp", "modern");
    document.documentElement.classList.add(initialTheme);
    
    // Update state once
    setTheme(initialTheme);
    setIsLoaded(true);
  }, []);

  const toggleTheme = (newTheme: Theme) => {
    // Update DOM first
    document.documentElement.classList.remove("xp", "modern");
    document.documentElement.classList.add(newTheme);
    
    // Update state
    setTheme(newTheme);
    
    // Persist to localStorage
    localStorage.setItem("theme", newTheme);
  };

  return {
    theme,
    toggleTheme,
    isLoaded,
  };
}
