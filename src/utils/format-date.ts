// Pure date formatting helper built on Intl.DateTimeFormat.
// Defaults to a "medium" en-US date; accepts overrides via opts.

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  /** BCP 47 locale tag. Defaults to the site locale. */
  locale?: string;
}

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
};

/**
 * Format a date string or Date into a localized, human-readable string.
 * Returns an empty string for invalid input rather than "Invalid Date".
 */
export function formatDate(date: string | Date, opts?: FormatDateOptions): string {
  const value = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const { locale = "en-US", ...intlOptions } = opts ?? {};

  // When the caller supplies any explicit field option, drop the default
  // dateStyle to avoid Intl throwing on mixed style/field configs.
  const hasFieldOptions = Object.keys(intlOptions).length > 0;
  const resolvedOptions: Intl.DateTimeFormatOptions = hasFieldOptions
    ? intlOptions
    : DEFAULT_OPTIONS;

  return new Intl.DateTimeFormat(locale, resolvedOptions).format(value);
}
