type SportSelectProps = {
  sports: string[];
  value: string | null;
  onChange: (sport: string | null) => void;
};

export function SportSelect({ sports, value, onChange }: SportSelectProps) {
  return (
    <select
      name="sport"
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value || null)}
      aria-label="Filter by sport"
      className="rounded-md border border-rule bg-surface px-3 py-2 font-body text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
    >
      <option value="">All sports</option>
      {sports.map((sport) => (
        <option key={sport} value={sport}>
          {sport}
        </option>
      ))}
    </select>
  );
}
