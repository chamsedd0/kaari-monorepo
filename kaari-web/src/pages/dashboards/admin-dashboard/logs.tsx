import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { PageContainer, PageHeader as AdminPageHeader, GlassCard, GlassTable, StatusBadge } from '../../../components/admin/AdminUI';
import { getAdminLogs, getPropertyRefreshLogs } from '../../../backend/server-actions/AdminLogServerActions';
import { AdminLog } from '../../../backend/entities';
import { formatDateSafe } from '../../../utils/dates';
import AdminTableScaffold from '../../../components/admin/AdminTableScaffold';
import { IoRefreshOutline, IoPersonOutline, IoHomeOutline, IoShieldCheckmarkOutline, IoCloseCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

const LogsPageContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeaderLocal = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font: ${Theme.typography.fonts.h2};
    color: ${Theme.colors.black};
    margin-bottom: 8px;
  }
  
  p {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  select {
    padding: 8px 12px;
    border: 1px solid ${Theme.colors.gray}40;
    border-radius: 8px;
    font: ${Theme.typography.fonts.mediumM};
    background: white;
    min-width: 150px;
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.secondary};
    }
  }
`;

const LogsContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${Theme.colors.gray}20;
  overflow: hidden;
`;

const LogItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${Theme.colors.gray}10;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${Theme.colors.gray}05;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const LogIcon = styled.div<{ action: AdminLog['action'] }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  
  ${({ action }) => {
    switch (action) {
      case 'property_refresh':
        return `
          background: ${Theme.colors.success}15;
          color: ${Theme.colors.success};
        `;
      case 'user_blocked':
        return `
          background: ${Theme.colors.error}15;
          color: ${Theme.colors.error};
        `;
      case 'user_unblocked':
        return `
          background: ${Theme.colors.success}15;
          color: ${Theme.colors.success};
        `;
      case 'team_assigned':
        return `
          background: ${Theme.colors.secondary}15;
          color: ${Theme.colors.secondary};
        `;
      default:
        return `
          background: ${Theme.colors.gray}15;
          color: ${Theme.colors.gray2};
        `;
    }
  }}
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const LogContent = styled.div`
  flex: 1;
  
  .description {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
    margin-bottom: 4px;
  }
  
  .metadata {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
`;

const LogTime = styled.div`
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.gray2};
  text-align: right;
  min-width: 100px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${Theme.colors.gray2};
  
  h3 {
    font: ${Theme.typography.fonts.h4};
    margin-bottom: 8px;
  }
  
  p {
    font: ${Theme.typography.fonts.mediumM};
  }
`;

// Loading handled by AdminTableScaffold

const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit] = useState<number>(50);
  const [filter, setFilter] = useState<AdminLog['action'] | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    loadLogs(true);
  }, [filter]);

  const loadLogs = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let logsData: AdminLog[];
      if (filter === 'all') {
        logsData = await getAdminLogs({ limit });
      } else {
        logsData = await getAdminLogs({ action: filter, limit });
      }
      
      setLogs(reset ? logsData : [...logs, ...logsData]);
      setHasMore(logsData.length === limit);
    } catch (err) {
      console.error('Error loading admin logs:', err);
      setError('Failed to load admin logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: AdminLog['action']) => {
    switch (action) {
      case 'property_refresh':
        return <IoRefreshOutline />;
      case 'user_blocked':
        return <IoCloseCircleOutline />;
      case 'user_unblocked':
        return <IoCheckmarkCircleOutline />;
      case 'team_assigned':
        return <IoPersonOutline />;
      case 'property_approved':
      case 'property_rejected':
        return <IoHomeOutline />;
      default:
        return <IoShieldCheckmarkOutline />;
    }
  };

  const getActionLabel = (action: AdminLog['action']) => {
    switch (action) {
      case 'property_refresh':
        return 'Property Refresh';
      case 'user_blocked':
        return 'User Blocked';
      case 'user_unblocked':
        return 'User Unblocked';
      case 'property_approved':
        return 'Property Approved';
      case 'property_rejected':
        return 'Property Rejected';
      case 'team_assigned':
        return 'Team Assigned';
      case 'photoshoot_completed':
        return 'Photoshoot Completed';
      default:
        return 'Other Action';
    }
  };

  return (
    <PageContainer>
      <AdminPageHeader title="Admin Logs" subtitle="View all administrator activity and system events" />

      <AdminTableScaffold
        loading={loading}
        error={error}
        isEmpty={!loading && !error && logs.length === 0}
        onRetry={() => loadLogs(true)}
        hasMore={hasMore}
        onLoadMore={() => loadLogs(false)}
        header={
          <FilterSection>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as AdminLog['action'] | 'all')}
            >
              <option value="all">All Actions</option>
              <option value="property_refresh">Property Refresh</option>
              <option value="user_blocked">User Blocked</option>
              <option value="user_unblocked">User Unblocked</option>
              <option value="property_approved">Property Approved</option>
              <option value="property_rejected">Property Rejected</option>
              <option value="team_assigned">Team Assigned</option>
              <option value="photoshoot_completed">Photoshoot Completed</option>
            </select>
          </FilterSection>
        }
      >
        <GlassCard>
          <GlassTable>
            <thead>
              <tr>
                <th>Action</th>
                <th>Description</th>
                <th>Performed By</th>
                <th>Target</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <StatusBadge status={getActionLabel(log.action)}>
                      {getActionIcon(log.action)} {getActionLabel(log.action)}
                    </StatusBadge>
                  </td>
                  <td>{log.description}</td>
                  <td>{log.performedBy || 'System'}</td>
                  <td>{log.targetUserId || log.targetPropertyId || '-'}</td>
                  <td>{formatDateSafe(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </GlassTable>
        </GlassCard>
      </AdminTableScaffold>
    </PageContainer>
  );
};

export default AdminLogsPage; 