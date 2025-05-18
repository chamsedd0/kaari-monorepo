'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { createSampleRefundRequest, createSampleCancellationRequest } from '../../../backend/server-actions/AdminServerActions';

const Container = styled.div`
  padding: 2rem;
  
  h1 {
    font: ${Theme.typography.fonts.h3};
    margin-bottom: 1.5rem;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    margin-bottom: 2rem;
  }
  
  .action-card {
    background-color: white;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.md};
    padding: 1.5rem;
    
    h3 {
      font: ${Theme.typography.fonts.h4B};
      margin-bottom: 1rem;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
      margin-bottom: 1.5rem;
    }
    
    button {
      background-color: ${Theme.colors.secondary};
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: ${Theme.borders.radius.sm};
      font: ${Theme.typography.fonts.smallB};
      cursor: pointer;
      
      &:hover {
        background-color: ${Theme.colors.secondary}CC;
      }
      
      &:disabled {
        background-color: ${Theme.colors.gray};
        cursor: not-allowed;
      }
    }
  }
  
  .result {
    margin-top: 1rem;
    font: ${Theme.typography.fonts.smallM};
    
    &.success {
      color: #4CAF50;
    }
    
    &.error {
      color: #F44336;
    }
  }
`;

const TestDataGenerator: React.FC = () => {
  const [creatingRefund, setCreatingRefund] = useState(false);
  const [refundResult, setRefundResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [creatingCancellation, setCreatingCancellation] = useState(false);
  const [cancellationResult, setCancellationResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const handleCreateRefundRequest = async () => {
    try {
      setCreatingRefund(true);
      setRefundResult(null);
      
      const id = await createSampleRefundRequest();
      
      setRefundResult({
        success: true,
        message: `Successfully created refund request with ID: ${id}`
      });
    } catch (error: any) {
      setRefundResult({
        success: false,
        message: error.message || 'Failed to create refund request'
      });
    } finally {
      setCreatingRefund(false);
    }
  };
  
  const handleCreateCancellationRequest = async () => {
    try {
      setCreatingCancellation(true);
      setCancellationResult(null);
      
      const id = await createSampleCancellationRequest();
      
      setCancellationResult({
        success: true,
        message: `Successfully created cancellation request with ID: ${id}`
      });
    } catch (error: any) {
      setCancellationResult({
        success: false,
        message: error.message || 'Failed to create cancellation request'
      });
    } finally {
      setCreatingCancellation(false);
    }
  };
  
  return (
    <Container>
      <h1>Test Data Generator</h1>
      
      <div className="actions">
        <div className="action-card">
          <h3>Refund Requests</h3>
          <p>Create a sample refund request with random data. This will be visible in the Refund Requests admin panel.</p>
          <button 
            onClick={handleCreateRefundRequest} 
            disabled={creatingRefund}
          >
            {creatingRefund ? 'Creating...' : 'Create Refund Request'}
          </button>
          
          {refundResult && (
            <div className={`result ${refundResult.success ? 'success' : 'error'}`}>
              {refundResult.message}
            </div>
          )}
        </div>
        
        <div className="action-card">
          <h3>Cancellation Requests</h3>
          <p>Create a sample cancellation request with random data. This will be visible in the Cancellation Requests admin panel.</p>
          <button 
            onClick={handleCreateCancellationRequest} 
            disabled={creatingCancellation}
          >
            {creatingCancellation ? 'Creating...' : 'Create Cancellation Request'}
          </button>
          
          {cancellationResult && (
            <div className={`result ${cancellationResult.success ? 'success' : 'error'}`}>
              {cancellationResult.message}
            </div>
          )}
        </div>
      </div>
      
      <p><strong>Note:</strong> This page is for development and testing purposes only. It should be removed or hidden in production.</p>
    </Container>
  );
};

export default TestDataGenerator; 