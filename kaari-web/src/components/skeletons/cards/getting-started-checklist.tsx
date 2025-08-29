import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Theme } from '../../../theme/theme';
import { FaCheck, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChecklistItem } from '../../../hooks/useGettingStartedChecklist';

interface GettingStartedChecklistProps {
  items: ChecklistItem[];
  onCompleteItem?: (id: string) => void;
  isItemClickable: (id: string) => boolean;
  getItemVisibility: (id: string) => 'full' | 'partial' | 'hidden';
}

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const checkmarkAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const progressAnimation = keyframes`
  from {
    width: var(--prev-progress);
  }
  to {
    width: var(--current-progress);
  }
`;

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(143, 39, 206, 1);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(143, 39, 206, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(143, 39, 206, 0);
  }
`;

// Styled components
const ChecklistContainer = styled.div`
  background-color: ${Theme.colors.white};
  border-radius: 12px;
  border: ${Theme.borders.primary};
  padding: clamp(16px, 3vw, 24px);
  width: 100%;
  margin-top: 16px;
  animation: ${fadeIn} 0.5s ease-out;

  &.mobile-condensed {
    padding: 12px;
  }
`;

const ChecklistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(10px, 2vw, 16px);
`;

const Title = styled.h3`
  font: ${Theme.typography.fonts.h4DB};
  color: ${Theme.colors.black};
  margin: 0;
`;

const ProgressContainer = styled.div`
  background-color: #f0f0f0;
  border-radius: 100px;
  height: 8px;
  width: 100%;
  margin-bottom: 24px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ progress: number; prevProgress: number }>`
  background-color: ${Theme.colors.secondary};
  height: 100%;
  border-radius: 100px;
  width: ${props => props.progress}%;
  --prev-progress: ${props => props.prevProgress}%;
  --current-progress: ${props => props.progress}%;
  animation: ${progressAnimation} 0.8s ease-out;
`;

const ChecklistItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2vw, 12px);
`;

// Mobile: condensed next-step row
const NextItemRow = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: ${Theme.borders.primary};
  background: #faf7ff;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;

  &:hover { background: #f4efff; }

  .icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${Theme.colors.secondary};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
    flex: 1;
  }

  .chevron {
    color: ${Theme.colors.gray2};
  }
`;

const MobileActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;

  .show-all {
    background: transparent;
    border: none;
    color: ${Theme.colors.secondary};
    font: ${Theme.typography.fonts.smallB};
    cursor: pointer;
    padding: 6px 8px;
  }
`;

interface ChecklistItemWrapperProps {
  completed: boolean;
  showAnimation: boolean;
  clickable: boolean;
  visibility: 'full' | 'partial' | 'hidden';
}

const ChecklistItemWrapper = styled.div<ChecklistItemWrapperProps>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${props => {
    if (props.visibility === 'hidden') return 'transparent';
    if (props.completed) return 'rgba(143, 39, 206, 0.05)';
    if (props.clickable) return 'rgba(143, 39, 206, 0.02)';
    return 'transparent';
  }};
  border: 1px solid ${props => props.completed ? 'rgba(143, 39, 206, 0.1)' : 'transparent'};
  opacity: ${props => {
    if (props.visibility === 'hidden') return 0;
    if (props.visibility === 'partial') return 0.5;
    return props.completed ? 0.7 : 1;
  }};
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  height: ${props => props.visibility === 'hidden' ? '0' : 'auto'};
  padding: ${props => props.visibility === 'hidden' ? '0' : '12px 16px'};
  margin: ${props => props.visibility === 'hidden' ? '0' : '0'};

  ${props => props.clickable && css`
    &:hover {
      background-color: rgba(143, 39, 206, 0.05);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 8px;
      animation: ${pulseAnimation} 2s infinite;
      z-index: 0;
    }
  `}
`;

interface CheckmarkContainerProps {
  completed: boolean;
  showAnimation: boolean;
  clickable: boolean;
}

const CheckmarkContainer = styled.div<CheckmarkContainerProps>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => {
    if (props.completed) return Theme.colors.secondary;
    if (props.clickable) return 'rgba(143, 39, 206, 0.1)';
    return 'transparent';
  }};
  border: 2px solid ${props => {
    if (props.completed) return Theme.colors.secondary;
    if (props.clickable) return Theme.colors.secondary;
    return Theme.colors.gray;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
  
  svg {
    animation: ${props => props.showAnimation ? checkmarkAnimation : 'none'} 0.5s ease-out;
  }
`;

interface ItemTitleProps {
  completed: boolean;
  clickable: boolean;
}

const ItemTitle = styled.span<ItemTitleProps>`
  font: ${Theme.typography.fonts.largeM};
  color: ${props => {
    if (props.completed) return Theme.colors.gray2;
    if (props.clickable) return Theme.colors.black;
    return Theme.colors.gray2;
  }};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
`;

const LockIcon = styled.div`
  margin-left: auto;
  color: ${Theme.colors.gray};
  opacity: 0.5;
  position: relative;
  z-index: 1;
`;

const CompletionText = styled.div`
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.gray2};
  margin-top: 16px;
  text-align: center;
`;

const NextStepText = styled.div`
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.secondary};
  margin-top: 16px;
  text-align: center;
`;

const GettingStartedChecklist: React.FC<GettingStartedChecklistProps> = ({ 
  items, 
  onCompleteItem,
  isItemClickable,
  getItemVisibility
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [prevProgress, setPrevProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllMobile, setShowAllMobile] = useState(false);
  
  // Use useMemo for derived state to prevent unnecessary re-renders
  const checklist = useMemo(() => {
    return [...items].sort((a, b) => a.order - b.order);
  }, [items]);
  
  // Calculate if all items are completed
  const allCompleted = useMemo(() => {
    return items.length > 0 && items.every(item => item.completed);
  }, [items]);
  
  // Find the next available item
  const nextItem = useMemo(() => {
    return items.find(item => isItemClickable(item.id));
  }, [items, isItemClickable]);

  useEffect(() => {
    // Calculate progress when items change
    const completedCount = items.filter(item => item.completed).length;
    setPrevProgress(progress);
    setProgress((completedCount / items.length) * 100);
  }, [items, progress]);

  // Track viewport for mobile rendering
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 640);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleItemClick = (item: ChecklistItem) => {
    // Only allow clicking if the item is the next available
    if (!isItemClickable(item.id)) return;
    
    // Only navigate to the route or execute the action
    if (item.route) {
      navigate(item.route);
    } else if (item.action) {
      item.action();
    }
    
    // Remove the automatic completion when clicking
    // if (onCompleteItem) {
    //   onCompleteItem(item.id);
    // }
  };

  // Mobile condensed view
  if (isMobile && !showAllMobile) {
    return (
      <ChecklistContainer className="mobile-condensed">
        <ChecklistHeader>
          <Title>{t('advertiser_dashboard.getting_started.title', 'Getting Started')}</Title>
          <span>{Math.round(progress)}%</span>
        </ChecklistHeader>
        <ProgressContainer>
          <ProgressBar progress={progress} prevProgress={prevProgress} />
        </ProgressContainer>
        {nextItem && (
          <NextItemRow onClick={() => handleItemClick(nextItem)} aria-label={nextItem.title}>
            <div className="icon">✓</div>
            <div className="label">{nextItem.title}</div>
            <div className="chevron">›</div>
          </NextItemRow>
        )}
        <MobileActions>
          <button className="show-all" onClick={() => setShowAllMobile(true)}>
            {t('common.show_all', 'Show all')}
          </button>
        </MobileActions>
      </ChecklistContainer>
    );
  }

  // Default full view
  return (
    <ChecklistContainer>
      <ChecklistHeader>
        <Title>{t('advertiser_dashboard.getting_started.title', 'Getting Started')}</Title>
        <span>{Math.round(progress)}%</span>
      </ChecklistHeader>
      
      <ProgressContainer>
        <ProgressBar progress={progress} prevProgress={prevProgress} />
      </ProgressContainer>
      
      <ChecklistItemsContainer>
        {checklist.map((item) => {
          const visibility = getItemVisibility(item.id);
          const clickable = isItemClickable(item.id);
          
          return (
            <ChecklistItemWrapper 
              key={item.id} 
              completed={item.completed}
              showAnimation={!!item.showAnimation}
              clickable={clickable}
              visibility={visibility}
              onClick={() => handleItemClick(item)}
            >
              <CheckmarkContainer 
                completed={item.completed} 
                showAnimation={!!item.showAnimation}
                clickable={clickable}
              >
                {item.completed && <FaCheck size={12} />}
              </CheckmarkContainer>
              <ItemTitle 
                completed={item.completed}
                clickable={clickable}
              >
                {item.title}
              </ItemTitle>
              
              {!item.completed && !clickable && visibility === 'partial' && (
                <LockIcon>
                  <FaLock size={12} />
                </LockIcon>
              )}
            </ChecklistItemWrapper>
          );
        })}
      </ChecklistItemsContainer>
    </ChecklistContainer>
  );
};

export default GettingStartedChecklist; 