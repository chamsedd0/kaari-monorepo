import { Property } from '../backend/entities';
import { Timestamp } from 'firebase/firestore';

// Number of days after which a property needs availability refresh
export const REFRESH_INTERVAL_DAYS = 7;

/**
 * Convert a date-like value to a Date object
 * @param dateValue Date, Timestamp, or date string
 * @returns Date object
 */
const toDate = (dateValue: Date | Timestamp | string | any): Date => {
  if (!dateValue) {
    return new Date();
  }
  
  // If it's already a Date object
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  // If it's a Firestore Timestamp
  if (dateValue && typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  
  // If it has seconds and nanoseconds (Firestore timestamp-like object)
  if (dateValue && typeof dateValue.seconds === 'number') {
    return new Date(dateValue.seconds * 1000);
  }
  
  // If it's a string or number, try to parse it
  return new Date(dateValue);
};

/**
 * Format time difference in a human-readable way
 * @param date The date to compare with now (can be Date, Timestamp, or string)
 * @returns formatted string like "2 minutes ago", "3 hours ago", etc.
 */
export const formatTimeAgo = (date: Date | Timestamp | string | any): string => {
  const dateObj = toDate(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  if (diffMs < 0) {
    return 'just now';
  }
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  } else if (diffWeeks > 0) {
    return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffSeconds > 30) {
    return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
};

/**
 * Check if a property needs availability refresh
 * @param property The property to check
 * @returns true if property needs refresh (7+ days since last refresh or never refreshed)
 */
export const needsAvailabilityRefresh = (property: Property): boolean => {
  if (!property.lastAvailabilityRefresh) {
    return true; // Never refreshed
  }
  
  const daysSinceRefresh = getDaysSinceLastRefresh(property);
  return daysSinceRefresh >= REFRESH_INTERVAL_DAYS;
};

/**
 * Get the number of days since the property was last refreshed
 * @param property The property to check
 * @returns number of days since last refresh, or Infinity if never refreshed
 */
export const getDaysSinceLastRefresh = (property: Property): number => {
  if (!property.lastAvailabilityRefresh) {
    return Infinity;
  }
  
  const now = new Date();
  const lastRefresh = toDate(property.lastAvailabilityRefresh);
  const diffTime = Math.abs(now.getTime() - lastRefresh.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Get refresh status for display
 * @param property The property to check
 * @returns object with status and message
 */
export const getRefreshStatus = (property: Property): {
  status: 'needs_refresh' | 'recently_refreshed' | 'never_refreshed' | 'recent';
  message: string;
  detailedMessage: string;
  daysRemaining?: number;
} => {
  if (!property.lastAvailabilityRefresh) {
    return {
      status: 'never_refreshed',
      message: 'Availability not confirmed',
      detailedMessage: 'This property\'s availability has never been confirmed. Click to confirm it\'s still available for rent.'
    };
  }
  
  const lastRefreshDate = toDate(property.lastAvailabilityRefresh);
  const timeAgo = formatTimeAgo(lastRefreshDate);
  const daysSinceRefresh = getDaysSinceLastRefresh(property);
  
  if (daysSinceRefresh >= 14) {
    return {
      status: 'needs_refresh',
      message: `Refresh needed (${timeAgo})`,
      detailedMessage: `This property was last refreshed ${timeAgo}. It's overdue for refresh and needs immediate attention.`
    };
  } else if (daysSinceRefresh >= REFRESH_INTERVAL_DAYS) {
    return {
      status: 'needs_refresh',
      message: `Refresh needed (${timeAgo})`,
      detailedMessage: `This property was last refreshed ${timeAgo}. It needs to be refreshed every ${REFRESH_INTERVAL_DAYS} days to keep listings accurate.`
    };
  }
  
  const daysRemaining = REFRESH_INTERVAL_DAYS - daysSinceRefresh;
  return {
    status: 'recent',
    message: `Refreshed ${timeAgo}`,
    detailedMessage: `This property was refreshed ${timeAgo}. Next refresh needed in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.`,
    daysRemaining
  };
};

/**
 * Count properties that need refresh from a list
 * @param properties Array of properties to check
 * @returns number of properties that need refresh
 */
export const countPropertiesNeedingRefresh = (properties: Property[]): number => {
  return properties.filter(needsAvailabilityRefresh).length;
}; 