type LeagueMetaProps = {
  leagueName: string;
  sport: string;
  season: string | null;
  alternateName: string | null;
  description: string | null;
  fromCache: boolean;
};

export function LeagueMeta({ leagueName, sport, season, alternateName, description, fromCache }: LeagueMetaProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-xl font-bold text-ink">{leagueName}</h2>
        {fromCache && (
          <span className="whitespace-nowrap rounded border border-rule px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
            cached
          </span>
        )}
      </div>
      <p className="font-mono text-xs uppercase tracking-wide text-muted">
        {sport}
        {season ? ` · ${season}` : ""}
      </p>
      <p className="font-body text-sm text-muted">Also known as: {alternateName ?? "—"}</p>
      {description && <p className="font-body text-sm text-ink">{description}</p>}
    </div>
  );
}
