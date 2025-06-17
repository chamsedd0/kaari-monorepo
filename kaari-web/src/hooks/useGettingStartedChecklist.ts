import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../backend/store';
import { getAdvertiserChecklist, updateAdvertiserChecklistItem } from '../backend/server-actions/AdvertiserServerActions';
import { ChecklistItem } from '../backend/entities';

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
  const [loading, setLoading] = useState(true);
  // Use a ref to track active animation timeouts and prevent duplicate updates
  const animationTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  // Track ongoing updates to prevent duplicate API calls
  const pendingUpdatesRef = useRef<Record<string, boolean>>({});

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

  // Initialize checklist from Firestore or defaults
  useEffect(() => {
    if (!user?.id || initialized) return;

    const fetchChecklist = async () => {
      setLoading(true);
      try {
        // Get checklist from Firestore
        const firestoreChecklist = await getAdvertiserChecklist();
        
        if (firestoreChecklist.length > 0) {
          // Merge with default items to ensure all items are present and have current translations
          const mergedItems = defaultItems.map(defaultItem => {
            const savedItem = firestoreChecklist.find(item => item.id === defaultItem.id);
            return savedItem ? { 
              ...defaultItem,
              completed: savedItem.completed,
              completedAt: savedItem.completedAt
            } : defaultItem;
          });
          setItems(mergedItems);
        } else {
          // No checklist in Firestore yet, use defaults
          setItems(defaultItems);
        }
      } catch (error) {
        console.error('Error fetching checklist from Firestore:', error);
        // Fallback to defaults if Firestore fails
        setItems(defaultItems);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    
    fetchChecklist();
  }, [user?.id, initialized, defaultItems]);

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
  const completeItem = async (id: string) => {
    // Check if the item is already completed to prevent duplicate updates
    const isAlreadyCompleted = items.find(item => item.id === id)?.completed;
    if (isAlreadyCompleted) return;
    
    // Check if an update is already in progress for this item
    if (pendingUpdatesRef.current[id]) return;
    
    // Mark update as in progress
    pendingUpdatesRef.current[id] = true;

    try {
      // Update in Firestore first
      await updateAdvertiserChecklistItem(id, true);
      
      // Then update local state for immediate UI feedback
      setItems(prevItems => {
        return prevItems.map(item => {
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
    } catch (error) {
      console.error('Error completing checklist item:', error);
    } finally {
      // Mark update as complete
      delete pendingUpdatesRef.current[id];
    }
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
    loading,
    allCompleted: items.length > 0 && items.every(item => item.completed)
  };
}; 