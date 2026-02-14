/**
 * Convert milliseconds to a human-readable time format
 * @param ms - Time in milliseconds
 * @returns Human-readable string (e.g., "5 minutes", "1 hour", "2 days")
 */
export function formatTimeFromMs(ms: number): string {
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;

  if (weeks >= 1 && weeks % 1 === 0) {
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }
  if (days >= 1 && days % 1 === 0) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }
  if (hours >= 1 && hours % 1 === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  if (minutes >= 1 && minutes % 1 === 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }
  return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
}

/**
 * Convert time value and unit to milliseconds
 * @param value - Numeric value
 * @param unit - Time unit (seconds, minutes, hours, days, weeks)
 * @returns Time in milliseconds
 */
export function timeToMs(value: number, unit: string): number {
  switch (unit) {
    case "seconds":
      return value * 1000;
    case "minutes":
      return value * 60 * 1000;
    case "hours":
      return value * 60 * 60 * 1000;
    case "days":
      return value * 24 * 60 * 60 * 1000;
    case "weeks":
      return value * 7 * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}

/**
 * Parse milliseconds to value and unit for form display
 * @param ms - Time in milliseconds
 * @returns Object with value and unit
 */
export function msToTimeUnit(ms: number): { value: number; unit: string } {
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;

  if (weeks >= 1 && weeks % 1 === 0) {
    return { value: weeks, unit: "weeks" };
  }
  if (days >= 1 && days % 1 === 0) {
    return { value: days, unit: "days" };
  }
  if (hours >= 1 && hours % 1 === 0) {
    return { value: hours, unit: "hours" };
  }
  if (minutes >= 1 && minutes % 1 === 0) {
    return { value: minutes, unit: "minutes" };
  }
  return { value: seconds, unit: "seconds" };
}

/**
 * Validate that milliseconds value is at least the minimum (3 seconds)
 */
export const MIN_ALERT_MS = 3000; // 3 seconds
