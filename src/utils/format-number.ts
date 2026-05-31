// Pure number formatting helpers built on Intl.NumberFormat.
// formatNumber -> grouped decimal; formatCompactNumber -> short notation (1.2K).

/**
 * Format a number with locale-aware grouping separators (e.g. 1,234,567).
 */
export function formatNumber(n: number, locale: string = "en-US"): string {
  if (!Number.isFinite(n)) {
    return "0";
  }

  return new Intl.NumberFormat(locale).format(n);
}

/**
 * Format a number in compact notation (e.g. 1.2K, 3.4M), max one decimal.
 */
export function formatCompactNumber(n: number, locale: string = "en-US"): string {
  if (!Number.isFinite(n)) {
    return "0";
  }

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
