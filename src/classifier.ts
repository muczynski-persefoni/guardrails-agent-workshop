import { ClassificationResult } from "./types";

/**
 * Phrase-based blocklist matching. Fast, dependency-free, and good enough
 * for the traffic profile we see today.
 */
const UNSAFE_PHRASES = [
  "drop table",
  "rm -rf",
  "ignore previous instructions",
  "delete all records",
];

export function classify(input: string): ClassificationResult {
  const words = input.toLowerCase().split(/\s+/);
  const wordSet = new Set(words);

  for (const phrase of UNSAFE_PHRASES) {
    const phraseWords = phrase.split(" ");
    const matchesAnyWord = phraseWords.some((w) => wordSet.has(w));
    if (matchesAnyWord) {
      return { label: "unsafe" };
    }
  }

  return { label: "safe" };
}
