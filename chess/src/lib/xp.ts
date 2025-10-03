export function calculateRatingDelta(
  playerRating: number,
  opponentRating: number,
  result: 1 | 0 | 0.5
): number {
  // Simple ELO delta with K-factor 32
  const k = 32;
  const expected = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  return Math.round(k * (result - expected));
}
