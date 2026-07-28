type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <input
      type="search"
      name="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search leagues…"
      aria-label="Search leagues"
      className="w-full rounded-md border border-rule bg-surface px-3 py-2 font-body text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
    />
  );
}
