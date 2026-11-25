export type QiblaAlignment = "waiting" | "aligned" | "misaligned";

// A small release margin prevents flickering near the matching boundary.
export function getQiblaAlignment(
  qibla: number | null,
  heading: number | null,
  previous: QiblaAlignment = "waiting",
): QiblaAlignment {
  if (qibla === null || heading === null || !Number.isFinite(qibla) || !Number.isFinite(heading)) return "waiting";
  const difference = Math.abs(((heading - qibla + 180) % 360 + 360) % 360 - 180);
  return difference <= (previous === "aligned" ? 14 : 10) ? "aligned" : "misaligned";
}