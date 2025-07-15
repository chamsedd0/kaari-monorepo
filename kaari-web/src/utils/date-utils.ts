/**
 * Date utility functions for formatting and manipulating dates
 */

/**
 * Format a date as DD.MM.YYYY
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}.${month}.${year}`;
}

/**
 * Format a date as Month DD, YYYY (e.g., January 01, 2023)
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatLongDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return d.toLocaleDateString('en-US', options);
}

/**
 * Calculate the difference between two dates in days
 * @param date1 First date
 * @param date2 Second date
 * @returns Number of days between the dates
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  // Check if dates are valid
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return 0;
  }
  
  // Calculate difference in milliseconds
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  
  // Convert to days
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is in the past
 * @param date The date to check
 * @returns True if the date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return false;
  }
  
  const now = new Date();
  return d < now;
}

/**
 * Check if a date is in the future
 * @param date The date to check
 * @returns True if the date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return false;
  }
  
  const now = new Date();
  return d > now;
}

/**
 * Add days to a date
 * @param date The date to add days to
 * @param days Number of days to add
 * @returns New date with days added
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return new Date();
  }
  
  d.setDate(d.getDate() + days);
  return d;
} 