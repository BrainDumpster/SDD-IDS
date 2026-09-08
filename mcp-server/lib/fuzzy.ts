/** Suggest closest component slugs when a lookup misses. */

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) {
    return n;
  }
  if (n === 0) {
    return m;
  }

  const row = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) {
    row[j] = j;
  }

  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return row[n];
}

/**
 * Rank candidate slugs by substring match then edit distance.
 * Returns up to `limit` suggestions (may be empty).
 */
export function suggestClosestSlugs(query: string, candidates: string[], limit = 5): string[] {
  const needle = query.trim().toLowerCase();
  if (!needle || candidates.length === 0) {
    return [];
  }

  const scored = candidates.map((slug) => {
    const hay = slug.toLowerCase();
    let score = levenshtein(needle, hay);
    if (hay.includes(needle) || needle.includes(hay)) {
      score = Math.max(0, score - 3);
    }
    if (hay.startsWith(needle) || needle.startsWith(hay)) {
      score = Math.max(0, score - 2);
    }
    return { slug, score };
  });

  scored.sort((a, b) => a.score - b.score || a.slug.localeCompare(b.slug));

  const maxDistance = Math.max(3, Math.floor(needle.length / 2) + 1);
  return scored
    .filter((entry) => entry.score <= maxDistance)
    .slice(0, limit)
    .map((entry) => entry.slug);
}

export function formatDidYouMean(suggestions: string[]): string {
  if (suggestions.length === 0) {
    return "";
  }
  return `\n\nDid you mean: ${suggestions.map((s) => `\`${s}\``).join(", ")}?`;
}
