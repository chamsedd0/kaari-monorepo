import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaExclamationCircle, FaInbox, FaSpinner, FaSync } from 'react-icons/fa';

const ScaffoldContainer = styled.div`
  position: relative;
  border-radius: 20px;
  border: 1px solid ${Theme.colors.tertiary}60;
  background: radial-gradient(140% 200% at 0% -30%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.8) 60%), linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0.2));
  backdrop-filter: saturate(140%) blur(14px);
  box-shadow: 0 18px 54px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.65);
  overflow: hidden;
`;

const HeaderSlot = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${Theme.colors.tertiary}60;
  background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4));
  backdrop-filter: blur(8px);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${Theme.colors.gray2};
  .spinner { animation: spin 1s linear infinite; font-size: 2rem; margin-bottom: 1rem; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${Theme.colors.error};
  .retry-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: ${Theme.borders.radius.sm};
    background-color: ${Theme.colors.secondary};
    color: white;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${Theme.colors.gray2};
`;

const FooterSlot = styled.div`
  padding: 10px 16px;
  border-top: 1px solid ${Theme.colors.tertiary}60;
  text-align: center;
  background: linear-gradient(180deg, rgba(255,255,255,0.4), rgba(255,255,255,0.32));
  backdrop-filter: blur(8px);
`;

type Props = {
  loading: boolean;
  error?: string | null;
  isEmpty: boolean;
  onRetry?: () => void;
  header?: React.ReactNode;
  children: React.ReactNode;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

const AdminTableScaffold: React.FC<Props> = ({
  loading,
  error,
  isEmpty,
  onRetry,
  header,
  children,
  hasMore,
  onLoadMore,
}) => {
  return (
    <ScaffoldContainer>
      {header && <HeaderSlot>{header}</HeaderSlot>}
      {loading ? (
        <LoadingState>
          <FaSpinner className="spinner" />
          <p>Loading...</p>
        </LoadingState>
      ) : error ? (
        <ErrorState>
          <FaExclamationCircle />
          <h3>Error</h3>
          <p>{error}</p>
          {onRetry && (
            <button className="retry-button" onClick={onRetry}>
              <FaSync /> Retry
            </button>
          )}
        </ErrorState>
      ) : isEmpty ? (
        <EmptyState>
          <FaInbox />
          <h3>No Data</h3>
          <p>No results to display.</p>
        </EmptyState>
      ) : (
        <>{children}</>
      )}
      {!loading && !error && hasMore && onLoadMore && (
        <FooterSlot>
          <button className="retry-button" onClick={onLoadMore}>
            <FaSync /> Load More
          </button>
        </FooterSlot>
      )}
    </ScaffoldContainer>
  );
};

export default AdminTableScaffold;


