import { useEffect, useState } from "react";
import { ApiRequestError } from "../api/client";
import { getLeagueDetail } from "../api/leagues";
import { getLeagueBadge } from "../api/seasons";
import { badgeCache } from "../lib/cache";
import type { AsyncState, LeagueBadge, LeagueDetail } from "../types";

export type LeagueBadgeData = {
  badge: LeagueBadge;
  detail: LeagueDetail | null;
};

/**
 * A custom hook that fetches badge data for a given league.
 * @param leagueId The ID of the league for which to fetch badge data.
 * @returns The async state of the badge data fetch operation.
 */
export function useLeagueBadge(leagueId: string | null) {
  const [state, setState] = useState<AsyncState<LeagueBadgeData>>({ status: "idle" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!leagueId) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    badgeCache
      .fetchWithCache(`badge:${leagueId}`, async () => {
        const [badge, detail] = await Promise.all([getLeagueBadge(leagueId), getLeagueDetail(leagueId)]);
        return { badge, detail };
      })
      .then(({ value, fromCache }) => {
        if (!cancelled) setState({ status: "success", data: value, fromCache });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ status: "error", error: toApiError(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [leagueId, attempt]);

  const retry = () => {
    if (leagueId) badgeCache.invalidate(`badge:${leagueId}`);
    setAttempt((n) => n + 1);
  };

  return { state, retry };
}

function toApiError(error: unknown): { message: string; status?: number } {
  if (error instanceof ApiRequestError) {
    return { message: error.message, status: error.status };
  }
  return { message: "Something went wrong loading the badge." };
}
