import { useMemo, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { BadgeSheet } from "./components/BadgeSheet";
import { FilterBar } from "./components/FilterBar";
import { LeagueGrid } from "./components/LeagueGrid";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useLeagueBadge } from "./hooks/useLeagueBadge";
import { useLeagueFilters } from "./hooks/useLeagueFilters";
import { useLeagues } from "./hooks/useLeagues";
import { matchesQuery } from "./lib/text";

function App() {
  const { state, retry } = useLeagues();
  const { query, sport, setQuery, setSport, clear } = useLeagueFilters();
  const debouncedQuery = useDebouncedValue(query, 200);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);

  const leagues = state.status === "success" ? state.data : [];

  // Extract unique sports from the leagues and sort them alphabetically
  const sports = useMemo(() => {
    const unique = new Set(leagues.map((league) => league.strSport));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [leagues]);

  // Filter leagues based on the selected sport and search query
  const filteredLeagues = useMemo(() => {
    return leagues.filter((league) => {
      const matchesSport = !sport || league.strSport === sport;
      const matchesSearch =
        matchesQuery(league.strLeague, debouncedQuery) ||
        (league.strLeagueAlternate ? matchesQuery(league.strLeagueAlternate, debouncedQuery) : false);
      return matchesSport && matchesSearch;
    });
  }, [leagues, sport, debouncedQuery]);

  const selectedLeague = leagues.find((league) => league.idLeague === selectedLeagueId) ?? null;
  const { state: badgeState, retry: retryBadge } = useLeagueBadge(selectedLeagueId);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <AppHeader total={leagues.length} />
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        sport={sport}
        onSportChange={setSport}
        sports={sports}
        resultCount={filteredLeagues.length}
      />
      <main className="p-4 sm:p-6">
        <LeagueGrid
          state={state}
          leagues={filteredLeagues}
          query={debouncedQuery}
          selectedLeagueId={selectedLeagueId}
          onSelectLeague={setSelectedLeagueId}
          onRetry={retry}
          onClearFilters={clear}
        />
      </main>
      <BadgeSheet
        league={selectedLeague}
        state={badgeState}
        onClose={() => setSelectedLeagueId(null)}
        onRetry={retryBadge}
      />
    </div>
  );
}

export default App;
