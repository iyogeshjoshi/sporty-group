type AppHeaderProps = {
  total: number;
};

export function AppHeader({ total }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-rule px-4 py-4 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">Sporty Group</h1>
      <span className="font-mono text-sm text-muted">{total} total</span>
    </header>
  );
}
