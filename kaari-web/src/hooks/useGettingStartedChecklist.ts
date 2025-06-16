import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../backend/store';

// Define the checklist item type
export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  route?: string;
  action?: () => void;
  showAnimation?: boolean;
  order: number; // Add order to enforce sequence
}

const STORAGE_KEY = 'kaari_getting_started_checklist';

export const useGettingStartedChecklist = () => {
  const { t } = useTranslation();
  const { user } = useStore();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  // Use a ref to track active animation timeouts and prevent duplicate updates
  const animationTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Define the default checklist items with order - memoize to prevent recreation on each render
  const defaultItems = useMemo(() => [
    {
      id: 'book_photoshoot',
      title: t('advertiser_dashboard.getting_started.book_photoshoot', 'Book photoshoot'),
      completed: false,
      route: '/photoshoot-booking',
      order: 1
    },
    {
      id: 'complete_profile',
      title: t('advertiser_dashboard.getting_started.complete_profile', 'Complete profile'),
      completed: false,
      route: '/dashboard/advertiser/profile',
      order: 2
    },
    {
      id: 'add_payout_method',
      title: t('advertiser_dashboard.getting_started.add_payout_method', 'Add payout method'),
      completed: false,
      route: '/dashboard/advertiser/payments',
      order: 3
    },
    {
      id: 'accept_booking',
      title: t('advertiser_dashboard.getting_started.accept_booking', 'Accept first booking'),
      completed: false,
      route: '/dashboard/advertiser/reservations',
      order: 4
    },
    {
      id: 'message_tenant',
      title: t('advertiser_dashboard.getting_started.message_tenant', 'Message tenant'),
      completed: false,
      route: '/dashboard/advertiser/messages',
      order: 5
    },
    {
      id: 'refresh_availability',
      title: t('advertiser_dashboard.getting_started.refresh_availability', 'Refresh availability'),
      completed: false,
      route: '/dashboard/advertiser/properties',
      order: 6
    }
  ], [t]); // Only recreate when translations change

  // Initialize checklist from localStorage or defaults
  useEffect(() => {
    if (!user?.id || initialized) return;

    const storageKey = `${STORAGE_KEY}_${user.id}`;
    const savedItems = localStorage.getItem(storageKey);
    
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Check if any new default items need to be added
        const mergedItems = defaultItems.map(defaultItem => {
          const savedItem = parsedItems.find((item: ChecklistItem) => item.id === defaultItem.id);
          return savedItem ? { ...defaultItem, ...savedItem } : defaultItem;
        });
        setItems(mergedItems);
      } catch (error) {
        console.error('Error parsing saved checklist items:', error);
        setItems(defaultItems);
      }
    } else {
      setItems(defaultItems);
    }
    
    setInitialized(true);
  }, [user?.id, initialized, defaultItems]);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!user?.id || !initialized) return;
    
    const storageKey = `${STORAGE_KEY}_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, user?.id, initialized]);

  // Clear all animation timeouts when component unmounts
  useEffect(() => {
    return () => {
      // Clear all timeouts on unmount
      Object.values(animationTimeoutsRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // Complete an item by ID
  const completeItem = (id: string) => {
    // Check if the item is already completed to prevent duplicate updates
    const isAlreadyCompleted = items.find(item => item.id === id)?.completed;
    if (isAlreadyCompleted) return;

    setItems(prevItems => {
      // Find the item to complete
      const itemToComplete = prevItems.find(item => item.id === id);
      if (!itemToComplete) return prevItems;
      
      // If item is already completed, don't update
      if (itemToComplete.completed) return prevItems;
      
      return prevItems.map(item => {
        // If this is the item to complete
        if (item.id === id) {
          return { ...item, completed: true, showAnimation: true };
        }
        return item;
      });
    });
    
    // Clear any existing timeout for this item
    if (animationTimeoutsRef.current[id]) {
      clearTimeout(animationTimeoutsRef.current[id]);
    }
    
    // Remove animation flag after animation completes
    animationTimeoutsRef.current[id] = setTimeout(() => {
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, showAnimation: false } 
            : item
        )
      );
      // Clean up the reference after the timeout completes
      delete animationTimeoutsRef.current[id];
    }, 1000);
  };

  // Get the next available item that should be clickable
  const getNextAvailableItem = () => {
    // Find the first incomplete item
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    return sortedItems.find(item => !item.completed);
  };

  // Check if an item is the next available (clickable) item
  const isItemClickable = (id: string) => {
    const nextItem = getNextAvailableItem();
    return nextItem?.id === id;
  };

  // Get the visibility status for an item (fully visible, partially visible, or hidden)
  const getItemVisibility = (id: string): 'full' | 'partial' | 'hidden' => {
    const item = items.find(i => i.id === id);
    if (!item) return 'hidden';
    
    const nextItem = getNextAvailableItem();
    
    // If item is completed, show fully
    if (item.completed) return 'full';
    
    // If item is the next available, show fully
    if (nextItem?.id === id) return 'full';
    
    // If item is within the next 2 in sequence after the next available, show partially
    const nextItemOrder = nextItem?.order || 1;
    if (item.order > nextItemOrder && item.order <= nextItemOrder + 2) return 'partial';
    
    // Otherwise hide it
    return 'hidden';
  };

  // Check if an item is completed
  const isItemCompleted = (id: string) => {
    return items.find(item => item.id === id)?.completed || false;
  };

  // Calculate progress percentage
  const progress = items.length > 0
    ? (items.filter(item => item.completed).length / items.length) * 100
    : 0;

  return {
    items,
    completeItem,
    isItemCompleted,
    isItemClickable,
    getItemVisibility,
    getNextAvailableItem,
    progress,
    allCompleted: items.length > 0 && items.every(item => item.completed)
  };
}; 