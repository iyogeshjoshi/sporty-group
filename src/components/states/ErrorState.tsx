type ErrorStateProps = {
  message: string;
  status?: number;
  onRetry: () => void;
};

export function ErrorState({ message, status, onRetry }: ErrorStateProps) {
  const copy = status === 429 ? "Too many requests. Retrying in 5s…" : message;

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-body text-ink">{copy}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded border border-rule px-4 py-2 font-body text-sm text-ink transition-colors hover:border-ink"
      >
        Retry
      </button>
    </div>
  );
}
