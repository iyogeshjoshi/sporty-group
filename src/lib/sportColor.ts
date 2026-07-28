const KNOWN_SPORT_COLORS: Record<string, string> = {
  soccer: "#1E9E5A",
  basketball: "#E4741B",
  motorsport: "#C2183A",
  "ice hockey": "#1B87C9",
  fighting: "#6B3FA0",
  "american football": "#8A5A2B",
  baseball: "#B0292F",
  rugby: "#2F6B4F",
};

/**
 * Gets the color for a given sport.
 * @param sport The name of the sport.
 * @returns The color for the sport.
 */
export function getSportColor(sport: string): string {
  const known = KNOWN_SPORT_COLORS[sport.trim().toLowerCase()];
  return known ?? "#9CA3AF"; // Default to gray if unknown
}
