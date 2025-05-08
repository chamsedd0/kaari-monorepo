import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { checkUserShouldSeeReviewPrompt, dismissReviewPrompt } from '../backend/server-actions/ReviewManagementActions';
import { FaTimes, FaStar, FaPen } from 'react-icons/fa';

const PromptContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 16px;
  z-index: 9999;
  animation: slideIn 0.3s ease-in-out;
  
  @keyframes slideIn {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const PromptHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
    display: flex;
    align-items: center;
    
    svg {
      color: #f1c40f;
      margin-right: 8px;
    }
  }
  
  button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #999;
    
    &:hover {
      color: #666;
    }
  }
`;

const PromptContent = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const PromptActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  ${props => props.primary 
    ? `
      background-color: #6366F1;
      color: white;
      border: none;
      
      &:hover {
        background-color: #4F46E5;
      }
    `
    : `
      background-color: white;
      color: #6366F1;
      border: 1px solid #D1D5DB;
      
      &:hover {
        background-color: #F9FAFB;
      }
    `
  }
  
  svg {
    margin-right: 6px;
  }
`;

interface ReviewPromptProps {
  onDismiss?: () => void;
}

const ReviewPrompt: React.FC<ReviewPromptProps> = ({ onDismiss }) => {
  const [prompt, setPrompt] = useState<{
    shouldShowPrompt: boolean;
    propertyId?: string;
    propertyName?: string;
    promptId?: string;
  }>({ shouldShowPrompt: false });
  
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkForPrompt = async () => {
      try {
        const promptData = await checkUserShouldSeeReviewPrompt();
        setPrompt(promptData);
        if (promptData.shouldShowPrompt) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error checking for review prompt:', error);
      }
    };
    
    checkForPrompt();
  }, []);
  
  const handleDismiss = async () => {
    setIsVisible(false);
    
    if (prompt.promptId) {
      try {
        await dismissReviewPrompt(prompt.promptId);
      } catch (error) {
        console.error('Error dismissing review prompt:', error);
      }
    }
    
    if (onDismiss) {
      onDismiss();
    }
  };
  
  const handleWriteReview = () => {
    if (prompt.propertyId && prompt.promptId) {
      navigate(`/dashboard/user/reviews/write?propertyId=${prompt.propertyId}&promptId=${prompt.promptId}`);
    }
  };
  
  if (!isVisible || !prompt.shouldShowPrompt) {
    return null;
  }
  
  return (
    <PromptContainer>
      <PromptHeader>
        <h3>
          <FaStar /> Write a Review
        </h3>
        <button onClick={handleDismiss}>
          <FaTimes />
        </button>
      </PromptHeader>
      
      <PromptContent>
        <p>You've recently moved into <strong>{prompt.propertyName}</strong>. How was your experience? Share your thoughts to help other students!</p>
      </PromptContent>
      
      <PromptActions>
        <ActionButton onClick={handleDismiss}>
          Later
        </ActionButton>
        <ActionButton primary onClick={handleWriteReview}>
          <FaPen /> Write Review
        </ActionButton>
      </PromptActions>
    </PromptContainer>
  );
};

export default ReviewPrompt; 