/**
 * Centralized Date & Time Utilities for Krivexo
 * Handles accurate Indian Standard Time (IST) formatting, parsing,
 * relative time generation, and standardized booking time slots.
 */

// Formats a date string, timestamp, or Date into "DD Mon YYYY" (e.g. "11 Sep 2026")
export function formatDate(input?: string | number | Date | null): string {
  if (!input) return "—";
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) {
      // If it's already a date string like "2026-09-12", try basic parse
      if (typeof input === "string" && input.includes("-")) {
        const parts = input.split("-");
        if (parts.length === 3) {
          const fallback = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          if (!isNaN(fallback.getTime())) {
            return fallback.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
          }
        }
      }
      return String(input);
    }
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(input || "—");
  }
}

// Formats a date string, timestamp, or Date into "HH:MM AM/PM" (e.g. "10:30 AM")
export function formatTime(input?: string | number | Date | null): string {
  if (!input) {
    const now = new Date();
    return now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) {
      // If string already looks like a time (e.g. "10:30 AM" or "10:30")
      if (typeof input === "string" && (input.includes("AM") || input.includes("PM") || input.includes(":"))) {
        return input;
      }
      return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    }
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
}

// Formats full date and time, e.g. "11 Sep 2026, 10:30 AM"
export function formatDateTime(input?: string | number | Date | null): string {
  if (!input) return formatDate(new Date()) + ", " + formatTime(new Date());
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) {
      return formatDate(input);
    }
    const datePart = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart}, ${timePart}`;
  } catch {
    return String(input);
  }
}

// Compact format for tables: e.g. "11/09/2026 10:30 AM"
export function formatDateTimeCompact(input?: string | number | Date | null): string {
  if (!input) return "—";
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return String(input);
    const datePart = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} ${timePart}`;
  } catch {
    return String(input);
  }
}

// Relative time with accurate fallback (e.g. "Just now", "10 mins ago", "Today at 10:30 AM", "Yesterday at 04:15 PM", "11 Sep 2026, 10:30 AM")
export function formatRelativeTime(input?: string | number | Date | null): string {
  if (!input) return "Just now";
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return String(input);
    
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHour / 24);

    if (diffSec < 45) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24 && now.getDate() === d.getDate()) {
      return `Today at ${formatTime(d)}`;
    }
    if (diffDays === 1 || (diffHour < 48 && now.getDate() - d.getDate() === 1)) {
      return `Yesterday at ${formatTime(d)}`;
    }
    return formatDateTime(d);
  } catch {
    return String(input);
  }
}

// Returns current ISO string
export function getCurrentIsoDateTime(): string {
  return new Date().toISOString();
}

// Returns default date for booking inputs (YYYY-MM-DD), default tomorrow or today
export function getDefaultBookingDate(daysAhead: number = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
}

// Standard time slots available for agriculture machinery, labour, soil test
export const BOOKING_TIME_SLOTS = [
  "06:00 AM - 09:00 AM (Early Morning)",
  "09:00 AM - 12:00 PM (Morning)",
  "12:00 PM - 03:00 PM (Afternoon)",
  "03:00 PM - 06:00 PM (Late Afternoon)",
  "06:00 PM - 09:00 PM (Evening)",
];

export const DEFAULT_BOOKING_TIME = "09:00 AM - 12:00 PM (Morning)";
