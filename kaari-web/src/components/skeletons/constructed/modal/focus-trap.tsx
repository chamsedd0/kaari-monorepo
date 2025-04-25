import React, { useState, useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  focusFirst?: boolean;
}

/**
 * FocusTrap component traps focus within its children
 * This helps improve accessibility by preventing users from
 * tabbing outside of modals or dropdowns while they're open
 */
const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  focusFirst = true
}) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [focusableEls, setFocusableEls] = useState<HTMLElement[]>([]);
  
  // Get all focusable elements when the component mounts
  useEffect(() => {
    if (!active || !elRef.current) return;
    
    // Find all focusable elements
    const selector = [
      'a[href]:not([tabindex="-1"])',
      'area[href]:not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      'button:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]:not([tabindex="-1"])'
    ].join(',');
    
    // Query the DOM for focusable elements
    const elements = Array.from(
      elRef.current.querySelectorAll<HTMLElement>(selector)
    ).filter(el => el.offsetParent !== null); // Filter out hidden elements
    
    setFocusableEls(elements);
    
    // Focus the first element when mounting if focusFirst is true
    if (focusFirst && elements.length > 0) {
      setTimeout(() => {
        elements[0].focus();
      }, 0);
    }
  }, [active, focusFirst]);
  
  // Handle tab key presses to trap focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!active || focusableEls.length === 0 || e.key !== 'Tab') return;
    
    // If shift + tab on first element, go to last element
    if (e.shiftKey && document.activeElement === focusableEls[0]) {
      e.preventDefault();
      focusableEls[focusableEls.length - 1].focus();
    } 
    // If tab on last element, go to first element
    else if (!e.shiftKey && document.activeElement === focusableEls[focusableEls.length - 1]) {
      e.preventDefault();
      focusableEls[0].focus();
    }
  };
  
  return (
    <div 
      ref={elRef} 
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

export default FocusTrap; 