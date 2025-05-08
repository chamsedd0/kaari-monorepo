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
        
        // Detailed logging of reservation data for debugging
        console.log('All tenant data:', JSON.stringify(data, null, 2));
        
        // Filter tenants - show completed or moved-in reservations
        // Both 'completed' and 'movedIn' statuses represent active tenants
        const filteredTenants = data.filter(res => 
          res.reservation.status === 'completed' || res.reservation.status === 'movedIn'
        );
        
        console.log('Filtered tenant data:', filteredTenants.length, 'active tenants found');
        
        // Log all reservation date fields for debugging
        filteredTenants.forEach((tenant, index) => {
          console.log(`Tenant ${index + 1} date fields:`, {
            moveInAt: tenant.reservation.movedInAt,
            moveInAtType: tenant.reservation.movedInAt ? typeof tenant.reservation.movedInAt : 'not set',
            movingDate: tenant.reservation.movingDate,
            movingDateType: tenant.reservation.movingDate ? typeof tenant.reservation.movingDate : 'not set',
            scheduledDate: tenant.reservation.scheduledDate, 
            scheduledDateType: tenant.reservation.scheduledDate ? typeof tenant.reservation.scheduledDate : 'not set',
            leavingDate: tenant.reservation.leavingDate,
            leavingDateType: tenant.reservation.leavingDate ? typeof tenant.reservation.leavingDate : 'not set'
          });
        });
        
        setTenants(filteredTenants);
        setError(null);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenants.');
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const formatDate = (date: Date | undefined | null) => {
    // Log the raw date input for debugging
    console.log('Date input:', date);
    
    // Check if date is undefined or null
    if (!date) return 'Not specified';
    
    let dateObj;
    
    // Handle different date formats that might be coming from the database
    if (typeof date === 'object' && date !== null) {
      if ('seconds' in date) {
        // Handle Firestore Timestamp object
        const timestamp = date as any;
        console.log('Timestamp format detected:', timestamp);
        dateObj = new Date(timestamp.seconds * 1000);
      } else if ('toDate' in date && typeof date.toDate === 'function') {
        // Handle Firestore Timestamp with toDate method
        console.log('Timestamp with toDate method detected');
        dateObj = (date as any).toDate();
      } else if (date instanceof Date) {
        // It's already a Date object
        dateObj = date;
      } else {
        // It's some other object
        console.log('Unknown object format:', JSON.stringify(date));
        try {
          // Try to convert to date anyway
          dateObj = new Date(date as any);
        } catch (e) {
          console.error('Failed to convert object to date:', e);
          return 'Invalid date format';
        }
      }
    } else if (typeof date === 'string') {
      // Handle date string
      console.log('String date format detected:', date);
      dateObj = new Date(date);
    } else if (typeof date === 'number') {
      // Handle timestamp number
      console.log('Timestamp number detected:', date);
      dateObj = new Date(date);
    } else {
      console.log('Unrecognized date format:', date, typeof date);
      return 'Invalid date format';
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.log('Invalid date object:', dateObj);
      return 'Invalid date';
    }
    
    // Log the formatted date for verification
    console.log('Formatted date:', dateObj.toLocaleDateString('en-GB'));
    
    // Return formatted date
    return dateObj.toLocaleDateString('en-GB');
  };

  // Helper to parse any date type safely
  const parseDateSafely = (date: any): Date | null => {
    if (!date) return null;
    
    let dateObj;
    
    try {
      if (typeof date === 'object' && date !== null) {
        if ('seconds' in date) {
          // Handle Firestore Timestamp object
          dateObj = new Date(date.seconds * 1000);
        } else if ('toDate' in date && typeof date.toDate === 'function') {
          // Handle Firestore Timestamp with toDate method
          dateObj = date.toDate();
        } else if (date instanceof Date) {
          // It's already a Date object
          dateObj = date;
        } else {
          // Try to convert to date
          dateObj = new Date(date);
        }
      } else if (typeof date === 'string') {
        // Handle date string
        dateObj = new Date(date);
      } else if (typeof date === 'number') {
        // Handle timestamp number
        dateObj = new Date(date);
      } else {
        return null;
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return null;
      }
      
      return dateObj;
    } catch (e) {
      console.error('Error parsing date:', e);
      return null;
    }
  };

  // Helper to determine if tenant is current, upcoming, or past based on dates
  const getTenantStatus = (moveInDate: Date | undefined | null, leaveDate: Date | undefined | null) => {
    const now = new Date();
    
    // Parse the dates safely
    const moveIn = parseDateSafely(moveInDate);
    const leave = parseDateSafely(leaveDate);
    
    // Default to current if no valid move-in date
    if (!moveIn) return 'Current';
    
    // If they have a valid leaving date that's in the past, they're a past tenant
    if (leave && leave < now) {
      return 'Past';
    }
    
    // If move-in date is in the future, it's upcoming
    if (moveIn > now) return 'Upcoming';
    
    // Otherwise it's a current tenant
    return 'Current';
  };

  // Helper to get the most reliable date field from tenant data
  const getMostReliableDate = (tenant: ReservationWithDetails) => {
    // Try movedInAt first (the most accurate)
    const movedInAt = parseDateSafely(tenant.reservation.movedInAt);
    if (movedInAt) return movedInAt;
    
    // Next try movingDate from the rental application
    const movingDate = parseDateSafely(tenant.reservation.movingDate);
    if (movingDate) return movingDate;
    
    // Finally fall back to scheduledDate
    const scheduledDate = parseDateSafely(tenant.reservation.scheduledDate);
    if (scheduledDate) return scheduledDate;
    
    // If all else fails, use today's date
    return new Date();
  };

  // Split tenants into categories based on their status
  const currentTenants = tenants.filter(tenant => 
    getTenantStatus(getMostReliableDate(tenant), tenant.reservation.leavingDate) === 'Current'
  );
  
  const upcomingTenants = tenants.filter(tenant => 
    getTenantStatus(getMostReliableDate(tenant), tenant.reservation.leavingDate) === 'Upcoming'
  );

  const pastTenants = tenants.filter(tenant => 
    getTenantStatus(getMostReliableDate(tenant), tenant.reservation.leavingDate) === 'Past'
  );

  // Combine both for display
  const allActiveTenants = [...currentTenants, ...upcomingTenants];

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
                <th>Leave Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4}>Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={4}>{error}</td></tr>
              ) : allActiveTenants.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <img src={emptyBox} alt="No tenants" style={{ width: 80, marginBottom: 12 }} />
                    <div style={{ color: '#888', fontSize: 16, marginTop: 8 }}>No tenants found.</div>
                  </td>
                </tr>
              ) : (
                allActiveTenants.map((tenant) => (
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
                      {/* Display the move-in date using the most reliable source */}
                      {formatDate(getMostReliableDate(tenant))}
                      {getTenantStatus(getMostReliableDate(tenant), tenant.reservation.leavingDate) === 'Current' && (
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
                      {getTenantStatus(getMostReliableDate(tenant), tenant.reservation.leavingDate) === 'Upcoming' && (
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
                    </td>
                    <td>
                      {formatDate(tenant.reservation.leavingDate)}
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
                <th>Leave Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4}>Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={4}>{error}</td></tr>
              ) : pastTenants.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px 0' }}>
                    <img src={emptyBox} alt="No tenants" style={{ width: 80, marginBottom: 12 }} />
                    <div style={{ color: '#888', fontSize: 16, marginTop: 8 }}>No past tenants found.</div>
                  </td>
                </tr>
              ) : (
                pastTenants.map((tenant) => (
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
                      {/* Display the move-in date using the most reliable source */}
                      {formatDate(getMostReliableDate(tenant))}
                      <span style={{
                        color: '#555',
                        background: '#f5f5f5',
                        borderRadius: 12,
                        padding: '2px 10px',
                        marginLeft: 8,
                        fontSize: 13,
                        fontWeight: 500
                      }}>
                        Past
                      </span>
                    </td>
                    <td>
                      {formatDate(tenant.reservation.leavingDate)}
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
