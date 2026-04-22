export type Theme = "xp";

export function useTheme() {
  const theme: Theme = "xp";

  const toggleTheme = (_nextTheme?: Theme) => {
    void _nextTheme;
    // Keep XP theme - no switching needed
  };

  return {
    theme,
    toggleTheme,
    isLoaded: true,
  };
}
