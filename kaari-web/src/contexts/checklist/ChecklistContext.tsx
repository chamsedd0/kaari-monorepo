import React, { createContext, useContext, ReactNode } from 'react';
import { useGettingStartedChecklist } from '../../hooks/useGettingStartedChecklist';

// Define the context type
interface ChecklistContextType {
  completeItem: (id: string) => void;
  isItemCompleted: (id: string) => boolean;
  isItemClickable: (id: string) => boolean;
  getItemVisibility: (id: string) => 'full' | 'partial' | 'hidden';
}

// Create the context with default values
const ChecklistContext = createContext<ChecklistContextType>({
  completeItem: () => {},
  isItemCompleted: () => false,
  isItemClickable: () => false,
  getItemVisibility: () => 'hidden',
});

// Custom hook to use the checklist context
export const useChecklist = () => useContext(ChecklistContext);

// Provider component
interface ChecklistProviderProps {
  children: ReactNode;
}

export const ChecklistProvider: React.FC<ChecklistProviderProps> = ({ children }) => {
  const { 
    completeItem, 
    isItemCompleted, 
    isItemClickable, 
    getItemVisibility 
  } = useGettingStartedChecklist();

  return (
    <ChecklistContext.Provider 
      value={{ 
        completeItem, 
        isItemCompleted, 
        isItemClickable, 
        getItemVisibility 
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
}; 