// Define known event types for better type safety
export enum EventType {
  // Auth related events
  AUTH_SIGNED_IN = 'auth:signedIn',
  AUTH_SIGNED_OUT = 'auth:signedOut',
  AUTH_STATE_CHANGED = 'auth:stateChanged',
  AUTH_ERROR = 'auth:error',
  AUTH_PASSWORD_RESET = 'auth:passwordReset',
  
  // User related events
  USER_PROFILE_UPDATED = 'user:profileUpdated',
  USER_PREFERENCES_CHANGED = 'user:preferencesChanged',
  
  // UI related events
  UI_MODAL_OPEN = 'ui:modalOpen',
  UI_MODAL_CLOSE = 'ui:modalClose',
  UI_THEME_CHANGED = 'ui:themeChanged',
  UI_TOAST_NOTIFICATION = 'ui:toastNotification',
  
  // Navigation related events
  NAV_ROUTE_CHANGED = 'nav:routeChanged',
  NAV_PRIVATE_ROUTE_ACCESS = 'nav:privateRouteAccess',
  
  // Application events
  APP_LOADED = 'app:loaded',
  APP_ERROR = 'app:error',
  APP_ONLINE_STATUS_CHANGED = 'app:onlineStatusChanged',
  
  // Profile events
  PROFILE_NAVIGATION_SUGGESTED = 'profile:navigationSuggested',
  PROFILE_COMPLETION_REMINDER = 'profile:completionReminder',
  
  // Checkout related events
  CHECKOUT_STEP_CHANGED = 'checkout:stepChanged'
}

// Define event payload types for type checking
export interface EventPayloads {
  [EventType.AUTH_SIGNED_IN]: { userId: string; email?: string; name?: string; role?: string };
  [EventType.AUTH_SIGNED_OUT]: { reason?: string };
  [EventType.AUTH_STATE_CHANGED]: { isAuthenticated: boolean; user: any | null };
  [EventType.AUTH_ERROR]: { code: string; message: string };
  [EventType.AUTH_PASSWORD_RESET]: { email: string; success: boolean };
  
  [EventType.USER_PROFILE_UPDATED]: { userId: string; fields: string[] };
  [EventType.USER_PREFERENCES_CHANGED]: { userId: string; preferences: Record<string, any> };
  
  [EventType.UI_MODAL_OPEN]: { modalId: string; props?: any };
  [EventType.UI_MODAL_CLOSE]: { modalId: string };
  [EventType.UI_THEME_CHANGED]: { theme: 'light' | 'dark' | 'system' };
  [EventType.UI_TOAST_NOTIFICATION]: { type: 'success' | 'error' | 'info' | 'warning'; message: string; duration?: number };
  
  [EventType.NAV_ROUTE_CHANGED]: { path: string; params?: Record<string, string> };
  [EventType.NAV_PRIVATE_ROUTE_ACCESS]: { path: string; redirectTo: string; isAuthenticated: boolean };
  
  [EventType.APP_LOADED]: { timestamp: number };
  [EventType.APP_ERROR]: { message: string; stack?: string; componentStack?: string };
  [EventType.APP_ONLINE_STATUS_CHANGED]: { isOnline: boolean };
  
  // Profile events
  [EventType.PROFILE_NAVIGATION_SUGGESTED]: { path: string; reason: string; timestamp: number };
  [EventType.PROFILE_COMPLETION_REMINDER]: { message: string; role?: string };
  
  // Allow for custom events with any payload
  [key: string]: any;
}

// Better typed callback definitions
type EventCallback<T = any> = (payload: T) => void;

// Type for event subscriptions with proper payload typing
interface EventSubscriptionMap {
  [eventName: string]: Array<{
    callback: EventCallback<any>;
    once: boolean;
  }>;
}

class EnhancedEventBus {
  private events: EventSubscriptionMap = {};
  private lastEventData: Record<string, any> = {}; // Store last event data for late subscribers
  private maxEventHistory = 10; // Maximum number of cached events per type
  private eventHistory: Record<string, any[]> = {}; // History of recent events

  /**
   * Subscribe to an event with proper typing
   * @param eventName Name of the event to subscribe to
   * @param callback Function to call when the event is emitted
   * @param options Additional options like replay last event, once, etc.
   * @returns Unsubscribe function
   */
  on<T extends EventType | string>(
    eventName: T, 
    callback: EventCallback<T extends EventType ? EventPayloads[T] : any>,
    options: { 
      replayLast?: boolean; // Immediately replay the last event if available
      once?: boolean;       // Execute only once then unsubscribe
    } = {}
  ): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    // Add the callback with the once flag
    this.events[eventName].push({
      callback,
      once: !!options.once
    });
    
    // If replayLast is true and we have cached data, call the callback immediately
    if (options.replayLast && this.lastEventData[eventName]) {
      callback(this.lastEventData[eventName]);
      
      // If this is a once subscription, remove it immediately after the replay
      if (options.once) {
        this.events[eventName] = this.events[eventName].filter(
          (sub) => sub.callback !== callback
        );
        return () => {}; // Return empty unsubscribe function since it's already removed
      }
    }
    
    // Return unsubscribe function
    return () => {
      if (!this.events[eventName]) return;
      
      this.events[eventName] = this.events[eventName].filter(
        (sub) => sub.callback !== callback
      );
      
      // Clean up the event array if empty
      if (this.events[eventName].length === 0) {
        delete this.events[eventName];
      }
    };
  }

  /**
   * Subscribe to an event and automatically unsubscribe after it's called once
   * @param eventName Name of the event to subscribe to
   * @param callback Function to call when the event is emitted
   * @returns Unsubscribe function
   */
  once<T extends EventType | string>(
    eventName: T, 
    callback: EventCallback<T extends EventType ? EventPayloads[T] : any>
  ): () => void {
    return this.on(eventName, callback, { once: true });
  }

  /**
   * Emit an event with typed payload
   * @param eventName Name of the event to emit
   * @param payload Data to pass to the event handlers
   */
  emit<T extends EventType | string>(
    eventName: T, 
    payload: T extends EventType ? EventPayloads[T] : any
  ): void {
    // Store the payload for late subscribers
    this.lastEventData[eventName] = payload;
    
    // Add to event history
    if (!this.eventHistory[eventName]) {
      this.eventHistory[eventName] = [];
    }
    
    // Add event to history with timestamp
    this.eventHistory[eventName].push({
      timestamp: Date.now(),
      payload
    });
    
    // Keep event history manageable
    if (this.eventHistory[eventName].length > this.maxEventHistory) {
      this.eventHistory[eventName].shift();
    }
    
    // If no subscribers, just return
    if (!this.events[eventName]) {
      return;
    }
    
    // Create a copy of the subscribers array to avoid issues if callbacks modify it
    const subscribers = [...this.events[eventName]];
    
    // Execute callbacks and collect once callbacks to remove
    const toRemove: EventCallback[] = [];
    
    subscribers.forEach((sub) => {
      sub.callback(payload);
      
      // If this is a once subscription, mark for removal
      if (sub.once) {
        toRemove.push(sub.callback);
      }
    });
    
    // Remove once callbacks if any
    if (toRemove.length > 0) {
      this.events[eventName] = this.events[eventName].filter(
        (sub) => !toRemove.includes(sub.callback)
      );
      
      // Clean up the event array if empty
      if (this.events[eventName].length === 0) {
        delete this.events[eventName];
      }
    }
  }

  /**
   * Get event history for debugging and monitoring
   * @param eventName Optional event name to filter history
   * @returns The event history for the specified event or all events
   */
  getHistory(eventName?: string): Record<string, any[]> {
    if (eventName) {
      return { [eventName]: this.eventHistory[eventName] || [] };
    }
    return { ...this.eventHistory };
  }

  /**
   * Check if an event has any subscribers
   * @param eventName Name of the event to check
   * @returns Whether the event has subscribers
   */
  hasSubscribers(eventName: string): boolean {
    return !!this.events[eventName] && this.events[eventName].length > 0;
  }

  /**
   * Remove all event listeners for a specific event
   * @param eventName Name of the event to clear
   */
  clear(eventName: string): void {
    delete this.events[eventName];
  }

  /**
   * Remove all event listeners and clear history
   */
  clearAll(): void {
    this.events = {};
    this.lastEventData = {};
    this.eventHistory = {};
  }
}

// Create a singleton instance of the enhanced event bus
const eventBus = new EnhancedEventBus();

// Legacy compatibility constants
export const AUTH_EVENTS = {
  SIGNED_IN: EventType.AUTH_SIGNED_IN,
  SIGNED_OUT: EventType.AUTH_SIGNED_OUT,
  AUTH_STATE_CHANGED: EventType.AUTH_STATE_CHANGED,
};

export default eventBus; 