import { ResultCount } from "./ResultCount";
import { SearchInput } from "./SearchInput";
import { SportSelect } from "./SportSelect";

type FilterBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  sport: string | null;
  onSportChange: (sport: string | null) => void;
  sports: string[];
  resultCount: number;
};

export function FilterBar({ query, onQueryChange, sport, onSportChange, sports, resultCount }: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-rule bg-paper/95 p-4 backdrop-blur sm:flex-row sm:items-center">
      <div className="flex-1">
        <SearchInput value={query} onChange={onQueryChange} />
      </div>
      <SportSelect sports={sports} value={sport} onChange={onSportChange} />
      <ResultCount count={resultCount} />
    </div>
  );
}
