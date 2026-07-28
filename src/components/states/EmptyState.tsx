type EmptyStateProps = {
  query: string;
  onClear: () => void;
};

export function EmptyState({ query, onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-body text-ink">{query ? `No leagues match "${query}".` : "No leagues match your filters."}</p>
      <button type="button" onClick={onClear} className="font-body text-sm text-brand underline underline-offset-2">
        Clear filters
      </button>
    </div>
  );
}
