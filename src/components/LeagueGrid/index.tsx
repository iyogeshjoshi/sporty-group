import type { AsyncState, League } from "../../types";
import { EmptyState } from "../states/EmptyState";
import { ErrorState } from "../states/ErrorState";
import { GridSkeleton } from "./GridSkeleton";
import { LeagueCard } from "./LeagueCard";

type LeagueGridProps = {
  state: AsyncState<League[]>;
  leagues: League[];
  query: string;
  selectedLeagueId: string | null;
  onSelectLeague: (id: string) => void;
  onRetry: () => void;
  onClearFilters: () => void;
};

export function LeagueGrid({
  state,
  leagues,
  query,
  selectedLeagueId,
  onSelectLeague,
  onRetry,
  onClearFilters,
}: LeagueGridProps) {
  if (state.status === "loading" || state.status === "idle") {
    return <GridSkeleton />;
  }

  if (state.status === "error") {
    return <ErrorState message={state.error.message} status={state.error.status} onRetry={onRetry} />;
  }

  if (leagues.length === 0) {
    return <EmptyState query={query} onClear={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {leagues.map((league) => (
        <LeagueCard
          key={league.idLeague}
          league={league}
          onSelect={onSelectLeague}
          isSelected={league.idLeague === selectedLeagueId}
        />
      ))}
    </div>
  );
}
