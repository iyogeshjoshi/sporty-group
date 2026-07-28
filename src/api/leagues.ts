import { fetchJson } from "./client";
import type { League, LeagueDetail, LeagueDetailResponse, LeaguesResponse } from "../types";

/**
 * Fetches all leagues from the API.
 * @returns Promise of an array of League objects
 */
export async function getAllLeagues(): Promise<League[]> {
  const data = await fetchJson<LeaguesResponse>("/all_leagues.php");
  const leagues = data.leagues ?? [];

  return leagues
    .map((league) => ({
      idLeague: league.idLeague,
      strLeague: league.strLeague,
      strSport: league.strSport,
      strLeagueAlternate: league.strLeagueAlternate ?? null,
    }))
    .sort((a, b) => a.strLeague.localeCompare(b.strLeague));
}

/**
 * Fetches detailed information about a specific league.
 * @param leagueId league's Id
 * @returns LeagueDetail object or null if not found
 */
export async function getLeagueDetail(leagueId: string): Promise<LeagueDetail | null> {
  const data = await fetchJson<LeagueDetailResponse>(`/lookupleague.php?id=${encodeURIComponent(leagueId)}`);
  const detail = data.leagues?.[0];
  if (!detail) return null;

  return {
    idLeague: detail.idLeague,
    strLeague: detail.strLeague,
    strSport: detail.strSport,
    strLeagueAlternate: detail.strLeagueAlternate ?? null,
    strDescriptionEN: detail.strDescriptionEN ?? null,
  };
}
