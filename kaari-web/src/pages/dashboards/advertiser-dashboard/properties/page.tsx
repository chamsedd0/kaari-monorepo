import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { PropertiesPageStyle } from './styles';
import PropertyCardAdvertiserSide from '../../../../components/skeletons/cards/property-card-advertiser-side';
import picture from '../../../../assets/images/propertyExamplePic.png';
import PropertyExamplePic from '../../../../assets/images/propertyExamplePic.png';
import LeftArrow from '../../../../components/skeletons/icons/Icon_Arrow_Left.svg';
import RightArrow from '../../../../components/skeletons/icons/Icon_Arrow_Right.svg';
import { getAdvertiserProperties, checkPropertyHasActiveReservations } from '../../../../backend/server-actions/AdvertiserServerActions';
import { updateProperty, refreshPropertyAvailability, relistProperty } from '../../../../backend/server-actions/PropertyServerActions';
import { logPropertyRefresh } from '../../../../backend/server-actions/AdminLogServerActions';
import { Property } from '../../../../backend/entities';
import { useAuth } from '../../../../contexts/auth';
import PropertyUnlistConfirmationModal from '../../../../components/skeletons/constructed/modals/property-unlist-confirmation-modal';
import PropertyReservationsWarningModal from '../../../../components/skeletons/constructed/modals/property-with-reservations-warning-modal';
import EmptyBox from '../../../../assets/images/emptybox.svg';
import { PurpleButtonLB40 } from '../../../../components/skeletons/buttons/purple_LB40';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../contexts/ToastContext';
import { countPropertiesNeedingRefresh, getRefreshStatus, getDaysSinceLastRefresh, needsAvailabilityRefresh } from '../../../../utils/property-refresh-utils';

// Local UI helpers for clearer freshness & listing status
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const Pill = styled.span<{ $tone?: 'info' | 'warning' | 'danger' | 'success' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 9999px;
  font-size: 12px;
  border: 1px solid rgba(0,0,0,0.06);
  background: ${({ $tone }) =>
    $tone === 'danger' ? '#FEF2F2' :
    $tone === 'warning' ? '#FFFBEB' :
    $tone === 'success' ? '#ECFDF5' : '#EEF2FF'};
  color: ${({ $tone }) =>
    $tone === 'danger' ? '#B91C1C' :
    $tone === 'warning' ? '#92400E' :
    $tone === 'success' ? '#065F46' : '#3730A3'};
`;

const TextButton = styled.button`
  border: none;
  background: transparent;
  color: ${Theme.colors.secondary};
  font-size: 12px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  &:hover { background: ${Theme.colors.tertiary}33; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const RefreshBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${Theme.colors.tertiary}80;
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75));
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  margin: 12px 0 16px;
`;

// Mini progress ring (0-14 days)
const RingWrapper = styled.div`
  width: 20px; height: 20px; position: relative; display: inline-flex; align-items: center; justify-content: center;
`;

const ringColorFor = (days: number) => {
  if (days >= 14) return '#B91C1C'; // red
  if (days >= 7) return '#92400E'; // amber
  return '#065F46'; // green
};

const ProgressRing: React.FC<{ days: number }> = ({ days }) => {
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const maxDays = 14;
  const clamped = Math.max(0, Math.min(maxDays, days));
  const percent = clamped / maxDays;
  const strokeDashoffset = circumference * (1 - percent);
  const color = ringColorFor(days);
  return (
    <RingWrapper title={`${clamped}/14 days since refresh`}>
      <svg width={20} height={20}>
        <circle cx={10} cy={10} r={radius} stroke="#E5E7EB" strokeWidth={2} fill="none" />
        <circle cx={10} cy={10} r={radius} stroke={color} strokeWidth={2} fill="none"
          strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 10 10)" />
      </svg>
    </RingWrapper>
  );
};
import { useChecklist } from '../../../../contexts/checklist/ChecklistContext';

const PropertiesPage: React.FC = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const listedPropertiesRef = useRef<HTMLDivElement>(null);
    const unlistedPropertiesRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { completeItem } = useChecklist();
    
    // Modal states
    const [unlistModalOpen, setUnlistModalOpen] = useState(false);
    const [reservationsWarningModalOpen, setReservationsWarningModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Update state for the reservation reason
    const [reservationReason, setReservationReason] = useState<'completed' | 'pending' | 'accepted' | 'paid' | 'movedIn' | 'none'>('none');
    
    // Refresh states
    const [refreshingProperties, setRefreshingProperties] = useState<Set<string>>(new Set());
  const [refreshingAll, setRefreshingAll] = useState<boolean>(false);
    
    // Add navigate
    const navigate = useNavigate();
    
    // Load advertiser properties on component mount
    useEffect(() => {
        const loadProperties = async () => {
            try {
                setIsLoading(true);
                const data = await getAdvertiserProperties();
                setProperties(data);
                setError(null);
                
                // Check if all properties have been refreshed recently
                const needingRefresh = countPropertiesNeedingRefresh(data);
                if (needingRefresh === 0 && data.length > 0) {
                    // Mark the "Refresh availability" checklist item as completed
                    completeItem('refresh_availability');
                }
            } catch (err) {
                console.error('Error loading properties:', err);
                setError(t('advertiser_dashboard.properties.errors.load_failed'));
            } finally {
                setIsLoading(false);
            }
        };
        
        loadProperties();
    }, [t, completeItem]);
    
    // Filter properties by status
    const listedProperties = properties.filter(
        property => property.status === 'available'
    );
    
    const unlistedProperties = properties.filter(
        property => property.status === 'occupied'
    );
    
    // Count properties needing refresh for dashboard reminder
    const propertiesNeedingRefresh = countPropertiesNeedingRefresh(properties);
    
    const handleChangePropertyStatus = async (propertyId: string, newStatus: 'available' | 'occupied') => {
        try {
            setIsSubmitting(true);
            await updateProperty(propertyId, { status: newStatus });
            
            // Update local state to reflect the change without refetching
            setProperties(prevProperties => 
                prevProperties.map(property => 
                    property.id === propertyId 
                        ? { ...property, status: newStatus } 
                        : property
                )
            );
            
            // Close any open modals
            setUnlistModalOpen(false);
            setSelectedProperty(null);
        } catch (err) {
            console.error('Error updating property status:', err);
            setError(t('advertiser_dashboard.properties.errors.update_status_failed'));
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRefreshAvailability = async (propertyId: string) => {
        try {
            // Add property to refreshing set
            setRefreshingProperties(prev => new Set(prev).add(propertyId));
            
            // Find the property to get its details for logging
            const property = properties.find(p => p.id === propertyId);
            
            // Call the refresh API
            await refreshPropertyAvailability(propertyId);
            
            // Log the refresh action for admin tracking
            if (property && user) {
                await logPropertyRefresh(
                    propertyId,
                    property.title,
                    user.id,
                    `${user.name} ${user.surname || ''}`.trim()
                );
            }
            
            // Update local state to reflect the refresh
            const updatedProperties = properties.map(property => 
                property.id === propertyId 
                    ? { 
                        ...property, 
                        lastAvailabilityRefresh: new Date(),
                        updatedAt: new Date()
                      } 
                    : property
            );
            
            setProperties(updatedProperties);
            
            // Check if all properties have been refreshed after this update
            const needingRefresh = countPropertiesNeedingRefresh(updatedProperties);
            if (needingRefresh === 0) {
                // Mark the "Refresh availability" checklist item as completed
                completeItem('refresh_availability');
            }
            
            // Show success toast
            addToast(
                'success',
                t('advertiser_dashboard.properties.refresh.success_title', 'Availability Refreshed'),
                t('advertiser_dashboard.properties.refresh.success_message', 'Property availability has been confirmed and updated.')
            );
            
        } catch (err) {
            console.error('Error refreshing property availability:', err);
            
            // Show error toast
            addToast(
                'error',
                t('advertiser_dashboard.properties.refresh.error_title', 'Refresh Failed'),
                t('advertiser_dashboard.properties.refresh.error_message', 'Failed to refresh property availability. Please try again.')
            );
        } finally {
            // Remove property from refreshing set
            setRefreshingProperties(prev => {
                const newSet = new Set(prev);
                newSet.delete(propertyId);
                return newSet;
            });
        }
    };

    // Refresh all properties that need availability confirmation
    const handleRefreshAllDue = async () => {
        try {
            const due = properties.filter(p => needsAvailabilityRefresh(p));
            if (due.length === 0) return;
            setRefreshingAll(true);

            for (const prop of due) {
                // mark per-card refreshing
                setRefreshingProperties(prev => new Set(prev).add(prop.id));
                try {
                    await refreshPropertyAvailability(prop.id);
                    if (user) {
                        await logPropertyRefresh(
                          prop.id,
                          prop.title,
                          user.id,
                          `${user.name} ${user.surname || ''}`.trim()
                        );
                    }
                    // update local state
                    setProperties(prev => prev.map(p => p.id === prop.id ? {
                        ...p,
                        lastAvailabilityRefresh: new Date(),
                        updatedAt: new Date()
                    } : p));
                } catch (e) {
                    console.error('Batch refresh failed for', prop.id, e);
                } finally {
                    setRefreshingProperties(prev => {
                        const next = new Set(prev);
                        next.delete(prop.id);
                        return next;
                    });
                }
            }
        } finally {
            setRefreshingAll(false);
        }
    };
    
    const handleListProperty = async (property: Property) => {
        try {
            setIsSubmitting(true);
            
            // Check if the property has active reservations first
            const { hasActiveReservations, reason } = await checkPropertyHasActiveReservations(property.id);
            
            if (hasActiveReservations) {
                // Show toast error instead of modal
                let errorMessage = '';
                
                switch(reason) {
                    case 'movedIn':
                        errorMessage = t('advertiser_dashboard.properties.errors.has_moved_in_tenant');
                        break;
                    case 'paid':
                        errorMessage = t('advertiser_dashboard.properties.errors.has_paid_reservation');
                        break;
                    case 'completed':
                        errorMessage = t('advertiser_dashboard.properties.errors.has_active_tenant');
                        break;
                    case 'accepted':
                        errorMessage = t('advertiser_dashboard.properties.errors.has_accepted_reservation');
                        break;
                    case 'pending':
                        errorMessage = t('advertiser_dashboard.properties.errors.has_pending_reservation');
                        break;
                    default:
                        errorMessage = t('advertiser_dashboard.properties.errors.cannot_list_property');
                }
                
                // Show toast error notification
                addToast(
                    'error',
                    t('advertiser_dashboard.properties.errors.property_unavailable'),
                    errorMessage
                );
            } else {
                // No reservations, apply relist gate (30-day rule)
                const result = await relistProperty(property.id);
                
                // Update local property to reflect new status/listingStatus
                setProperties(prev => prev.map(p => p.id === property.id ? { ...p, status: result.status, listingStatus: result.listingStatus } : p));
                
                // Show feedback depending on result
                if (result.listingStatus === 'active') {
                    addToast(
                        'success',
                        t('advertiser_dashboard.properties.success.property_listed'),
                        t('advertiser_dashboard.properties.success.property_listed_message')
                    );
                } else if (result.listingStatus === 'pending_verification') {
                    addToast(
                        'info',
                        t('advertiser_dashboard.properties.success.property_pending_verification', 'Pending Verification'),
                        t('advertiser_dashboard.properties.success.property_pending_verification_message', 'Our team will verify your listing freshness before relisting.')
                    );
                }
            }
        } catch (err) {
            console.error('Error checking reservations:', err);
            setError(t('advertiser_dashboard.properties.errors.check_reservations_failed'));
            
            // Show error toast
            addToast(
                'error',
                t('advertiser_dashboard.properties.errors.operation_failed'),
                t('advertiser_dashboard.properties.errors.check_reservations_failed')
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const navigateToReservations = () => {
        navigate('/dashboard/advertiser/reservations');
    };
    
    const handleAskForEdit = (property: Property) => {
        navigate(`/dashboard/advertiser/properties/edit-request/${property.id}`);
    };
    
    const handleOpenUnlistModal = (property: Property) => {
        setSelectedProperty(property);
        setUnlistModalOpen(true);
    };
    
    const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return;
        
        // Card width (301px) + gap (20px)
        const scrollAmount = 321;
        
        const newScrollLeft = direction === 'left' 
            ? ref.current.scrollLeft - scrollAmount 
            : ref.current.scrollLeft + scrollAmount;
        
        ref.current.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    return (
        <PropertiesPageStyle>
            <div className="properties-section">
                <div className="section-top">
                <h2 className="properties-section-title">{t('advertiser_dashboard.properties.title')}</h2>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                {isLoading ? (
                    <div className="loading-spinner">{t('advertiser_dashboard.properties.loading')}</div>
                ) : (
                    <>
                 <div className="my-properties">
                    <div className="section-header">
                                <h3 className="title">{t('advertiser_dashboard.properties.listed_properties', { count: listedProperties.length })}</h3>
                                {listedProperties.length > 0 && (
                        <div className="navigation-buttons">
                            <button onClick={() => scroll('left', listedPropertiesRef)}>
                                <img src={LeftArrow} alt={t('common.left_arrow')} />
                            </button>
                            <button onClick={() => scroll('right', listedPropertiesRef)}>
                                <img src={RightArrow} alt={t('common.right_arrow')} />
                            </button>
                        </div>
                                )}
                            </div>
                            {/* Global freshness banner for listed properties needing refresh */}
                            {listedProperties.length > 0 && propertiesNeedingRefresh > 0 && (
                              <RefreshBanner>
                                <div style={{ fontSize: 13, color: '#6B7280' }}>
                                  {t('advertiser_dashboard.properties.refresh_banner', `${propertiesNeedingRefresh} properties need availability refresh to stay live. Auto-unlisting will occur after 14 days.`)}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <TextButton onClick={handleRefreshAllDue} disabled={refreshingAll}>
                                    {refreshingAll ? t('common.refreshing', 'Refreshing...') : t('advertiser_dashboard.properties.refresh_all_due', 'Refresh all due')}
                                  </TextButton>
                                  <TextButton onClick={() => window.scrollTo({ top: 99999, behavior: 'smooth' })}>
                                    {t('advertiser_dashboard.properties.view_all_refresh', 'View')}
                                  </TextButton>
                                </div>
                              </RefreshBanner>
                            )}
                            
                            {listedProperties.length === 0 ? (
                                <div className="no-properties-message">
                                    <img src={EmptyBox} alt={t('advertiser_dashboard.properties.no_properties_alt')} />
                                    <h4>{t('advertiser_dashboard.properties.no_listed_properties')}</h4>
                                    <p>{t('advertiser_dashboard.properties.list_property_photoshoot')}</p>
                                    <PurpleButtonLB40 text={t('advertiser_dashboard.properties.book_photoshoot')} onClick={() => window.location.href = '/photoshoot-booking'} />
                    </div>
                            ) : (
                    <div className="properties-group" ref={listedPropertiesRef}>
                                    {listedProperties.map(property => {
                                      const freshness = getRefreshStatus(property);
                                      const days = Number.isFinite(getDaysSinceLastRefresh(property)) ? getDaysSinceLastRefresh(property) : 0;
                                      const tone = freshness.status === 'needs_refresh' ? (freshness.detailedMessage.includes('overdue') ? 'danger' : 'warning') : 'success';
                                      return (
                        <PropertyCardAdvertiserSide 
                                            key={property.id}
                                            title={property.title}
                                            location={`${property.address.city}, ${property.address.country}`}
                                            images={property.images}
                                            price={`${property.price} ${t('common.per_month')}`}
                            minStay={t('common.min_stay', { count: 1 })}
                                            propertyId={property.id}
                                            property={property}
                                            onUnlist={() => handleOpenUnlistModal(property)}
                                            onAskForEdit={() => handleAskForEdit(property)}
                                            onRefreshAvailability={() => handleRefreshAvailability(property.id)}
                                            isSubmitting={isSubmitting}
                                            isRefreshing={refreshingProperties.has(property.id)}
                                        >
                                          <MetaRow>
                                            <Pill $tone={tone as any} title={freshness.detailedMessage}>
                                              <ProgressRing days={days} />
                                              {freshness.message}
                                            </Pill>
                                            {property.listingStatus && (
                                              <Pill $tone={property.listingStatus === 'active' ? 'success' : property.listingStatus === 'pending_verification' ? 'warning' : 'danger'}>
                                                {property.listingStatus === 'active' ? t('common.active', 'Active') : property.listingStatus === 'pending_verification' ? t('common.pending_verification', 'Pending verification') : t('common.auto_unlisted', 'Auto-unlisted')}
                                              </Pill>
                                            )}
                                            <TextButton onClick={() => handleRefreshAvailability(property.id)} disabled={refreshingProperties.has(property.id)}>
                                              {refreshingProperties.has(property.id) ? t('common.refreshing', 'Refreshing...') : t('common.refresh_now', 'Refresh now')}
                                            </TextButton>
                                          </MetaRow>
                                        </PropertyCardAdvertiserSide>
                                      );
                                    })}
                    </div>
                            )}
                </div>
                        
                <div className="my-properties">
                    <div className="section-header">
                                <h3 className="title">{t('advertiser_dashboard.properties.unlisted_properties', { count: unlistedProperties.length })}</h3>
                                {unlistedProperties.length > 0 && (
                        <div className="navigation-buttons">
                            <button onClick={() => scroll('left', unlistedPropertiesRef)}>
                                <img src={LeftArrow} alt={t('common.left_arrow')} />
                            </button>
                            <button onClick={() => scroll('right', unlistedPropertiesRef)}>
                                <img src={RightArrow} alt={t('common.right_arrow')} />
                            </button>
                        </div>
                                )}
                            </div>
                            
                            {unlistedProperties.length === 0 ? (
                                <div className="no-properties-message">
                                    <img src={EmptyBox} alt={t('advertiser_dashboard.properties.no_properties_alt')} />
                                    <h4>{t('advertiser_dashboard.properties.no_unlisted_properties')}</h4>
                    </div>
                            ) : (
                    <div className="properties-group" ref={unlistedPropertiesRef}>
                                    {unlistedProperties.map(property => {
                                      const freshness = getRefreshStatus(property);
                                      const tone = freshness.status === 'needs_refresh' ? (freshness.detailedMessage.includes('overdue') ? 'danger' : 'warning') : 'success';
                                      return (
                        <PropertyCardAdvertiserSide 
                                            key={property.id}
                                            title={property.title}
                                            location={`${property.address.city}, ${property.address.country}`}
                                            images={property.images}
                                            price={`${property.price} ${t('common.per_month')}`}
                            minStay={t('common.min_stay', { count: 1 })}
                                            propertyId={property.id}
                                            property={property}
                                            onList={() => handleListProperty(property)}
                                            onAskForEdit={() => handleAskForEdit(property)}
                                            onRefreshAvailability={() => handleRefreshAvailability(property.id)}
                                            isSubmitting={isSubmitting}
                                            isRefreshing={refreshingProperties.has(property.id)}
                                        >
                                          <MetaRow>
                                            <Pill $tone={tone as any} title={freshness.detailedMessage}>
                                              <ProgressRing days={Number.isFinite(getDaysSinceLastRefresh(property)) ? getDaysSinceLastRefresh(property) : 0} />
                                              {freshness.message}
                                            </Pill>
                                            {property.listingStatus && (
                                              <Pill $tone={property.listingStatus === 'active' ? 'success' : property.listingStatus === 'pending_verification' ? 'warning' : 'danger'}>
                                                {property.listingStatus === 'active' ? t('common.active', 'Active') : property.listingStatus === 'pending_verification' ? t('common.pending_verification', 'Pending verification') : t('common.auto_unlisted', 'Auto-unlisted')}
                                              </Pill>
                                            )}
                                            <TextButton onClick={() => handleRefreshAvailability(property.id)} disabled={refreshingProperties.has(property.id)}>
                                              {refreshingProperties.has(property.id) ? t('common.refreshing', 'Refreshing...') : t('common.refresh_now', 'Refresh now')}
                                            </TextButton>
                                          </MetaRow>
                                        </PropertyCardAdvertiserSide>
                                      );
                                    })}
                    </div>
                            )}
                </div>
                    </>
                )}
                
                {/* Unlist Confirmation Modal */}
                {selectedProperty && (
                    <>
                        <PropertyUnlistConfirmationModal
                            isOpen={unlistModalOpen}
                            onClose={() => {
                                setUnlistModalOpen(false);
                                setSelectedProperty(null);
                            }}
                            onConfirm={() => handleChangePropertyStatus(selectedProperty.id, 'occupied')}
                            propertyTitle={selectedProperty.title}
                        />
                        
                        <PropertyReservationsWarningModal
                            isOpen={reservationsWarningModalOpen}
                            onClose={() => {
                                setReservationsWarningModalOpen(false);
                                setSelectedProperty(null);
                            }}
                            onViewReservations={navigateToReservations}
                            propertyTitle={selectedProperty.title}
                            reason={reservationReason}
                        />
                    </>
                )}
            </div>
        </PropertiesPageStyle>
    );
};

export default PropertiesPage;

