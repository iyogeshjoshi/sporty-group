import { getSportColor } from "../../lib/sportColor";

type SportChipProps = {
  sport: string;
};

export function SportChip({ sport }: SportChipProps) {
  const color = getSportColor(sport);

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {sport}
    </span>
  );
}
