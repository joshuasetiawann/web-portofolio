// Pure reading-time estimate from word count and words-per-minute.

/**
 * Estimate reading time in whole minutes (rounded up, minimum 1).
 * @param text - The content to measure.
 * @param wpm - Average reading speed in words per minute (default 220).
 */
export function getReadingTime(text: string, wpm: number = 220): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  if (words === 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(words / wpm));
}
