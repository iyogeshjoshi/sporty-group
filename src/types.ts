// all_leagues.php
export type LeaguesResponse = {
  leagues: Array<{
    idLeague: string;
    strLeague: string;
    strSport: string;
    strLeagueAlternate?: string | null; // absent on free tier
  }> | null;
};

// search_all_seasons.php?badge=1&id=<id>
export type SeasonsResponse = {
  seasons:
    | Array<{ strSeason: string; strBadge: string | null }>
    | string // error message
    | null; // no seasons for this league
};

export type League = {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string | null;
};

// lookupleague.php?id=<id>
export type LeagueDetailResponse = {
  leagues: Array<{
    idLeague: string;
    strLeague: string;
    strSport: string;
    strLeagueAlternate?: string | null;
    strDescriptionEN?: string | null;
  }> | null;
};

export type LeagueDetail = {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string | null;
  strDescriptionEN: string | null;
};

export type LeagueBadge = {
  season: string;
  badgeUrl: string;
} | null; // null = fetched, genuinely none — still cached

export type ApiError = {
  message: string;
  status?: number;
};

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T; fromCache: boolean }
  | { status: "error"; error: ApiError };

export type LeagueCardProps = {
  league: League;
  onSelect: (id: string) => void;
  isSelected: boolean;
};
