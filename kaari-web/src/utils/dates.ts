// Safe date utilities for Firestore Timestamp | Date | string

export type FirestoreTimestampLike = { seconds: number; nanoseconds?: number };

export function toDateSafe(value: any): Date | null {
  try {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'object' && 'seconds' in value) {
      const ts = value as FirestoreTimestampLike;
      return new Date(ts.seconds * 1000);
    }
    if (typeof value === 'string') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  } catch {
    return null;
  }
}

export function formatDateSafe(value: any, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  const d = toDateSafe(value);
  if (!d) return 'N/A';
  try {
    return d.toLocaleDateString(locale, options || { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return 'N/A';
  }
}


