import { getSportColor } from "../../lib/sportColor";
import type { LeagueCardProps } from "../../types";
import { SportChip } from "./SportChip";

export function LeagueCard({ league, onSelect, isSelected }: LeagueCardProps) {
  const accent = getSportColor(league.strSport);

  return (
    <button
      type="button"
      onClick={() => onSelect(league.idLeague)}
      aria-pressed={isSelected}
      className="flex flex-col gap-2 rounded-lg border border-rule bg-surface p-4 text-left shadow-sm transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [content-visibility:auto]"
      style={{
        borderLeftColor: accent,
        borderLeftWidth: 4,
        borderTopColor: isSelected ? accent : undefined,
        borderRightColor: isSelected ? accent : undefined,
        borderBottomColor: isSelected ? accent : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <SportChip sport={league.strSport} />
        <span className="font-mono text-xs text-muted">{league.idLeague}</span>
      </div>
      <h3 className="font-display text-lg font-bold text-ink">{league.strLeague}</h3>
      <p className="font-body text-sm text-muted">{league.strLeagueAlternate ?? "—"}</p>
    </button>
  );
}
