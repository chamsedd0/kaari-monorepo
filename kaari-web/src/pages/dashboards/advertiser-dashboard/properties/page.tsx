import React, { useRef, useState, useEffect } from 'react';
import { PropertiesPageStyle } from './styles';
import PropertyCardAdvertiserSide from '../../../../components/skeletons/cards/property-card-advertiser-side';
import picture from '../../../../assets/images/propertyExamplePic.png';
import PropertyExamplePic from '../../../../assets/images/propertyExamplePic.png';
import LeftArrow from '../../../../components/skeletons/icons/Icon_Arrow_Left.svg';
import RightArrow from '../../../../components/skeletons/icons/Icon_Arrow_Right.svg';
import { getAdvertiserProperties, checkPropertyHasActiveReservations } from '../../../../backend/server-actions/AdvertiserServerActions';
import { updateProperty, refreshPropertyAvailability } from '../../../../backend/server-actions/PropertyServerActions';
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
import { countPropertiesNeedingRefresh } from '../../../../utils/property-refresh-utils';

const PropertiesPage: React.FC = () => {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const listedPropertiesRef = useRef<HTMLDivElement>(null);
    const unlistedPropertiesRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [properties, setProperties] = useState<Property[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    
    // Modal states
    const [unlistModalOpen, setUnlistModalOpen] = useState(false);
    const [reservationsWarningModalOpen, setReservationsWarningModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Update state for the reservation reason
    const [reservationReason, setReservationReason] = useState<'completed' | 'pending' | 'accepted' | 'paid' | 'movedIn' | 'none'>('none');
    
    // Refresh states
    const [refreshingProperties, setRefreshingProperties] = useState<Set<string>>(new Set());
    
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
            } catch (err) {
                console.error('Error loading properties:', err);
                setError(t('advertiser_dashboard.properties.errors.load_failed'));
            } finally {
                setIsLoading(false);
            }
        };
        
        loadProperties();
    }, [t]);
    
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
            setProperties(prevProperties => 
                prevProperties.map(property => 
                    property.id === propertyId 
                        ? { 
                            ...property, 
                            lastAvailabilityRefresh: new Date(),
                            updatedAt: new Date()
                          } 
                        : property
                )
            );
            
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
                // No reservations, update status to available
                await handleChangePropertyStatus(property.id, 'available');
                
                // Show success toast
                addToast(
                    'success',
                    t('advertiser_dashboard.properties.success.property_listed'),
                    t('advertiser_dashboard.properties.success.property_listed_message')
                );
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
                            
                            {listedProperties.length === 0 ? (
                                <div className="no-properties-message">
                                    <img src={EmptyBox} alt={t('advertiser_dashboard.properties.no_properties_alt')} />
                                    <h4>{t('advertiser_dashboard.properties.no_listed_properties')}</h4>
                                    <p>{t('advertiser_dashboard.properties.list_property_photoshoot')}</p>
                                    <PurpleButtonLB40 text={t('advertiser_dashboard.properties.book_photoshoot')} onClick={() => window.location.href = '/photoshoot-booking'} />
                    </div>
                            ) : (
                    <div className="properties-group" ref={listedPropertiesRef}>
                                    {listedProperties.map(property => (
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
                                        />
                                    ))}
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
                                    {unlistedProperties.map(property => (
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
                                        />
                                    ))}
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

