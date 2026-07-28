import { useCallback, useEffect, useState } from "react";

export type LeagueFilters = {
  query: string;
  sport: string | null;
};

/**
 * Reads the league filters from the URL.
 * @returns The league filters.
 */
function readFromUrl(): LeagueFilters {
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") ?? "",
    sport: params.get("sport"),
  };
}

/**
 * Writes the league filters to the URL.
 * @param filters The league filters.
 */
function writeToUrl(filters: LeagueFilters): void {
  const params = new URLSearchParams(window.location.search);

  if (filters.query) {
    params.set("q", filters.query);
  } else {
    params.delete("q");
  }

  if (filters.sport) {
    params.set("sport", filters.sport);
  } else {
    params.delete("sport");
  }

  const query = params.toString();
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, "", url);
}

/**
 * Custom hook to manage league filters (query and sport) with URL synchronization.
 * @returns {Object} The league filters and setter functions.
 */
export function useLeagueFilters() {
  const [filters, setFilters] = useState<LeagueFilters>(() => readFromUrl());

  useEffect(() => {
    writeToUrl(filters);
  }, [filters]);

  useEffect(() => {
    const onPopState = () => setFilters(readFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const setSport = useCallback((sport: string | null) => {
    setFilters((prev) => ({ ...prev, sport }));
  }, []);

  const clear = useCallback(() => {
    setFilters({ query: "", sport: null });
  }, []);

  return { query: filters.query, sport: filters.sport, setQuery, setSport, clear };
}
