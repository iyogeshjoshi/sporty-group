const COMBINING_MARKS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(COMBINING_MARKS_PATTERN, "").toLowerCase().trim();
}

export function matchesQuery(value: string, query: string): boolean {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  return normalizeText(value).includes(normalizedQuery);
}
