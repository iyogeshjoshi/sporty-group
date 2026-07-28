import { useEffect, useState } from "react";
import { ApiRequestError } from "../api/client";
import { getAllLeagues } from "../api/leagues";
import { leaguesCache } from "../lib/cache";
import type { AsyncState, League } from "../types";

const CACHE_KEY = "leagues:all";

/**
 * Custom hook to fetch and manage leagues with caching.
 * @returns {Object} The async state and retry function.
 */
export function useLeagues() {
  const [state, setState] = useState<AsyncState<League[]>>({ status: "idle" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    leaguesCache
      .fetchWithCache(CACHE_KEY, () => getAllLeagues())
      .then(({ value, fromCache }) => {
        if (!cancelled) setState({ status: "success", data: value, fromCache });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ status: "error", error: toApiError(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    leaguesCache.invalidate(CACHE_KEY);
    setAttempt((n) => n + 1);
  };

  return { state, retry };
}

function toApiError(error: unknown): { message: string; status?: number } {
  if (error instanceof ApiRequestError) {
    return { message: error.message, status: error.status };
  }
  return { message: "Something went wrong loading leagues." };
}
