import { fetchJson } from "./client";
import type { LeagueBadge, SeasonsResponse } from "../types";

export async function getLeagueBadge(leagueId: string): Promise<LeagueBadge> {
  const data = await fetchJson<SeasonsResponse>(
    `/search_all_seasons.php?badge=1&id=${encodeURIComponent(leagueId)}`
  );
  const { seasons } = data;

  if (!Array.isArray(seasons)) {
    return null;
  }

  const withBadge = seasons.find((entry) => Boolean(entry.strBadge));
  if (!withBadge?.strBadge) {
    return null;
  }

  return { season: withBadge.strSeason, badgeUrl: withBadge.strBadge };
}
