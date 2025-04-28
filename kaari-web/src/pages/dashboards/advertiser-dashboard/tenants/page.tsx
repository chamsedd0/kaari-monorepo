import React, { useEffect, useState } from 'react';
import { TenantsPageStyle } from './styles';
import tenantAvatar from '../../../../assets/images/HeroImage.png';
import emptyBox from '../../../../assets/images/emptybox.svg';
import { getAdvertiserReservationRequests } from '../../../../backend/server-actions/AdvertiserServerActions';
import { Request, Listing, Property, User } from '../../../../backend/entities';

interface ReservationWithDetails {
  reservation: Request;
  listing?: Listing | null;
  property?: Property | null;
  client?: User | null;
}

const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await getAdvertiserReservationRequests();
        setTenants(data.filter(res => res.reservation.status === 'accepted'));
        setError(null);
      } catch (err) {
        setError('Failed to load tenants.');
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB');
  };

  // Helper to determine if tenant is upcoming, current, or past
  const getTenantStatus = (moveInDate: Date | undefined) => {
    if (!moveInDate) return null;
    const now = new Date();
    const moveIn = new Date(moveInDate);
    // For demo, assume tenancy is current if move-in is today or in the past (no move-out info)
    if (moveIn > now) return 'Upcoming';
    return 'Current';
  };

  // For past tenants, you would ideally have a move-out date. For now, demo logic:
  const getPastTenants = () => {
    // If you add moveOutDate to reservation, use it here
    // For now, just return []
    return [];
  };

  // Show all accepted tenants as current or upcoming
  const currentAndUpcomingTenants = tenants;

  return (
    <TenantsPageStyle>
      <h2 className="title">Your Tenants</h2>
      <h3 className="group-title">Current and upcoming Tenants</h3>
      <div className="tenants-group">
        <div className="border-container">
          <table className="tenants-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Property</th>
                <th>Move-in Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3}>Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={3}>{error}</td></tr>
              ) : currentAndUpcomingTenants.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <img src={emptyBox} alt="No tenants" style={{ width: 80, marginBottom: 12 }} />
                    <div style={{ color: '#888', fontSize: 16, marginTop: 8 }}>No tenants found.</div>
                  </td>
                </tr>
              ) : (
                currentAndUpcomingTenants.map((tenant) => (
                  <tr key={tenant.reservation.id}>
                    <td>
                      <div className="tenant-info">
                        <img src={tenant.client?.profilePicture || tenantAvatar} alt="Tenant" />
                        <span className="tenant-name">{tenant.client ? `${tenant.client.name} ${tenant.client.surname || ''}` : 'Unknown Tenant'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="property-info">
                        <span className="property-name">{tenant.property?.title || 'Unknown Property'}</span>
                        {tenant.property?.address && (
                          <span className="property-location">
                            {tenant.property.address.city}, {tenant.property.address.country}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="move-in-date">
                      {formatDate(tenant.reservation.scheduledDate)}
                      {getTenantStatus(tenant.reservation.scheduledDate) === 'Upcoming' && (
                        <span style={{
                          color: '#ff9800',
                          background: '#fff3e0',
                          borderRadius: 12,
                          padding: '2px 10px',
                          marginLeft: 8,
                          fontSize: 13,
                          fontWeight: 500
                        }}>
                          Upcoming
                        </span>
                      )}
                      {getTenantStatus(tenant.reservation.scheduledDate) === 'Current' && (
                        <span style={{
                          color: '#1db954',
                          background: '#e8f5e9',
                          borderRadius: 12,
                          padding: '2px 10px',
                          marginLeft: 8,
                          fontSize: 13,
                          fontWeight: 500
                        }}>
                          Current
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="group-title">Past Tenants</h3>
      <div className="tenants-group">
        <div className="border-container">
          <table className="tenants-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Property</th>
                <th>Move-in Date</th>
              </tr>
            </thead>
            <tbody>
              {getPastTenants().length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <img src={emptyBox} alt="No tenants" style={{ width: 80, marginBottom: 12 }} />
                    <div style={{ color: '#888', fontSize: 16, marginTop: 8 }}>No tenants found.</div>
                  </td>
                </tr>
              ) : (
                getPastTenants().map((tenant) => (
                  <tr key={tenant.reservation.id}>
                    <td>
                      <div className="tenant-info">
                        <img src={tenant.client?.profilePicture || tenantAvatar} alt="Tenant" />
                        <span className="tenant-name">{tenant.client ? `${tenant.client.name} ${tenant.client.surname || ''}` : 'Unknown Tenant'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="property-info">
                        <span className="property-name">{tenant.property?.title || 'Unknown Property'}</span>
                        {tenant.property?.address && (
                          <span className="property-location">
                            {tenant.property.address.city}, {tenant.property.address.country}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="move-in-date">
                      {formatDate(tenant.reservation.scheduledDate)}
                      <span style={{
                        color: '#b80000',
                        background: '#ffebee',
                        borderRadius: 12,
                        padding: '2px 10px',
                        marginLeft: 8,
                        fontSize: 13,
                        fontWeight: 500
                      }}>
                        Past
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </TenantsPageStyle>
  );
};

export default TenantsPage;
