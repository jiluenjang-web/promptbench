export function normalizeSearchText(value) {
  return String(value ?? "").trim().toLocaleLowerCase("zh-Hant-TW");
}

export function includesQuery(values, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  return values.some((value) => normalizeSearchText(value).includes(normalizedQuery));
}
