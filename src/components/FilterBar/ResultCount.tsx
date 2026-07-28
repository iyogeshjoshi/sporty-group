type ResultCountProps = {
  count: number;
};

export function ResultCount({ count }: ResultCountProps) {
  return (
    <span className="whitespace-nowrap font-mono text-sm text-muted">
      {count} {count === 1 ? "league" : "leagues"}
    </span>
  );
}
