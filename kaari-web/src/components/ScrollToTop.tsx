import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../theme/theme';
import { FaArrowUp } from 'react-icons/fa';
import eventBus, { EventType } from '../utils/event-bus';

// Styled component for the scroll to top button
const ScrollButton = styled.button<{ isVisible: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${Theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: ${Theme.colors.secondary};
    transform: translateY(-3px);
  }
  
  &:focus {
    outline: none;
  }
`;

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Function to scroll to top
  const scrollToTopFunction = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  // Auto-scroll to top on route changes
  useEffect(() => {
    scrollToTopFunction();
  }, [pathname]);

  // Add custom event listener for checkout step changes
  useEffect(() => {
    // Define a custom event name for checkout step changes
    const customEventType = EventType.CHECKOUT_STEP_CHANGED || 'CHECKOUT_STEP_CHANGED';
    
    // Create event handler
    const handleCheckoutStepChange = () => {
      scrollToTopFunction();
    };
    
    // Register event listener through eventBus
    const unsubscribe = eventBus.on(customEventType, handleCheckoutStepChange);
    
    // Clean up listener
    return () => {
      unsubscribe();
    };
  }, []);

  // Track scroll position to show/hide button
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    
    // Initial check
    toggleVisibility();
    
    // Clean up the event listener
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top when button is clicked
  const scrollToTop = () => {
    scrollToTopFunction();
  };

  return (
    <ScrollButton 
      isVisible={isVisible} 
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <FaArrowUp />
    </ScrollButton>
  );
};

export default ScrollToTop; 