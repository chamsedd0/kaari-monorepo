import React, { useEffect, useState, useCallback, useRef } from 'react';
import { DashboardPageStyle } from './styles';
import PhotoshootStatusCard from '../../../../components/skeletons/cards/photoshoot-status-card';
import LatestRequestDashboardCard from '../../../../components/skeletons/cards/lateest-request-dashboard-card';
import MessagesCard from '../../../../components/skeletons/cards/messages-card';
import BookAPhotoshootComponent from '../../../../components/skeletons/cards/book-a-photoshoot-card';
import { PerformanceChart } from '../../../../components/skeletons/constructed/chart/performance-chart';
import { PropertyViewsTable } from '../../../../components/skeletons/constructed/chart/property-views-table';
import UpToDateCardComponent from '../../../../components/skeletons/cards/up-to-date-card';
import ListingGuideCard from '../../../../components/skeletons/cards/listing-guide-card';
import GettingStartedChecklist from '../../../../components/skeletons/cards/getting-started-checklist';
import { useGettingStartedChecklist } from '../../../../hooks/useGettingStartedChecklist';
import ReferralBanner from '../../../../components/skeletons/banners/referral-banner';
import FreePhotoshootBanner from '../../../../components/skeletons/banners/free-photoshoot-banner';
import emptyBox from '../../../../assets/images/emptybox.svg';
import profile from '../../../../assets/images/ProfilePicture.png'; // Default profile image for photographer
import { useNavigate } from 'react-router-dom';
import { 
    getAdvertiserStatistics, 
    getAdvertiserProperties, 
    getAdvertiserRequests,
    getAdvertiserReservationRequests,
    getAdvertiserPhotoshoots,
} from '../../../../backend/server-actions/AdvertiserServerActions';
import { useStore } from '../../../../backend/store';
import { Property, Request } from '../../../../backend/entities';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { countPropertiesNeedingRefresh } from '../../../../utils/property-refresh-utils';

// Extend Property interface to include missing properties
interface ExtendedProperty extends Property {
    clickCount?: number;
    viewCount?: number;
}

// Extend Request interface to include missing properties
interface ExtendedRequest extends Omit<Request, 'numPeople'> {
    moveInDate?: Date | string;
    numPeople?: string;
}

// Extend User interface to include missing properties
interface ExtendedUser {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    profilePicture?: string;
    paymentMethods?: any[];
}

// Real-time update interval (in milliseconds)
const REAL_TIME_UPDATE_INTERVAL = 30000; // 30 seconds

// Define module priority types
interface DashboardModule {
    id: string;
    priority: number;
    isActive: boolean;
}

// Define Photoshoot interface to match the PhotoshootBooking interface from entities.ts
interface DashboardPhotoshoot {
  id: string;
  propertyId?: string;
  date: Date;
  time: string;
  timeSlot?: string;
  photographerId?: string;
  photographerName?: string;
  photographerInfo?: string;
  photographerImage?: string;
  phoneNumber?: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled' | 'scheduled';
  createdAt: Date;
  updatedAt: Date;
  // Address fields from PhotoshootBooking
  streetName?: string;
  streetNumber?: string;
  city?: string;
  stateRegion?: string;
  postalCode?: string;
  country?: string;
  floor?: string;
  flat?: string;
}

const DashboardPage: React.FC = () => {
    const { user } = useStore();
    const extendedUser = user as unknown as ExtendedUser;
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState({
        totalProperties: 0,
        activeListings: 0,
        pendingReservations: 0,
        viewsCount: 0,
        photoshootsScheduled: 0,
        inquiriesCount: 0
    });
    const [properties, setProperties] = useState<ExtendedProperty[]>([]);
    const [requests, setRequests] = useState<ExtendedRequest[]>([]);
    const [photoshoots, setPhotoshoots] = useState<DashboardPhotoshoot[]>([]);
    const [reservationRequests, setReservationRequests] = useState<{
        reservation: ExtendedRequest;
        listing?: any;
        property?: any;
        client?: any;
    }[]>([]);
    const { 
        items: checklistItems, 
        completeItem, 
        isItemClickable, 
        getItemVisibility,
        isItemCompleted,
        loading: checklistLoading
    } = useGettingStartedChecklist();
    
    // Track last update time for real-time updates
    const lastUpdateRef = useRef<Date>(new Date());
    
    // Track active dashboard modules and their priorities
    const [dashboardModules, setDashboardModules] = useState<DashboardModule[]>([
        { id: 'latestRequest', priority: 1, isActive: false }, // Reservation requests have highest priority when not empty
        { id: 'upcomingPhotoshoot', priority: 2, isActive: false }, // Photoshoots have second highest priority when not empty
        { id: 'messages', priority: 3, isActive: false }, // Messages have third highest priority when not empty
        { id: 'performanceChart', priority: 4, isActive: false } // Performance chart has lowest priority when not empty
    ]);
    
    // Add state to track if the free photoshoot banner should be shown
    const [showFreePhotoshootBanner, setShowFreePhotoshootBanner] = useState(true);
    
    // Load data function - extracted to be reusable for real-time updates
    const loadData = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
            try {
                // Fetch statistics, properties, listings, requests, and photoshoots in parallel
            const [stats, props, reqs, reservationReqs, shoots] = await Promise.all([
                getAdvertiserStatistics(),
                    getAdvertiserProperties(),
                    getAdvertiserRequests(),
                    getAdvertiserReservationRequests(),
                    getAdvertiserPhotoshoots()
                ]);
                
            // Ensure all required properties exist in stats
            const updatedStats = {
                totalProperties: stats.totalProperties || 0,
                activeListings: stats.activeListings || 0,
                pendingReservations: stats.pendingReservations || 0,
                viewsCount: stats.viewsCount || 0,
                photoshootsScheduled: stats.photoshootsScheduled || 0,
                inquiriesCount: stats.inquiriesCount || 0
            };
            
            setStatistics(updatedStats);
            setProperties(props as ExtendedProperty[]);
            setRequests(reqs as ExtendedRequest[]);
            setReservationRequests(reservationReqs as {
                reservation: ExtendedRequest;
                listing?: any;
                property?: any;
                client?: any;
            }[]);
            setPhotoshoots(shoots as DashboardPhotoshoot[]);
            
            // Update last refresh time
            lastUpdateRef.current = new Date();
            
            // Update active modules based on data
            updateActiveModules(reservationReqs, reqs as ExtendedRequest[], shoots as DashboardPhotoshoot[], props as ExtendedProperty[], updatedStats);
            } catch (error) {
                console.error(t('advertiser_dashboard.dashboard.errors.loading_data', 'Error loading dashboard data:'), error);
            } finally {
            if (showLoading) setLoading(false);
        }
    }, [t]);
    
    // Update the updateActiveModules function to check if the free photoshoot banner should be shown
    const updateActiveModules = useCallback((
        reservationReqs: any[],
        reqs: ExtendedRequest[],
        shoots: DashboardPhotoshoot[],
        props: ExtendedProperty[],
        stats: any
    ) => {
        const updatedModules = [...dashboardModules];
        
        // Check if there are any photoshoots - if there are, don't show the free photoshoot banner
        const hasNoPhotoshoots = shoots.length === 0;
        setShowFreePhotoshootBanner(hasNoPhotoshoots);
        
        // Latest request module - check if it has actual content
        const hasLatestRequest = reservationReqs.some(req => req.reservation.status === 'pending');
        const latestRequestModule = updatedModules.find(m => m.id === 'latestRequest')!;
        latestRequestModule.isActive = true; // Always show, even if empty
        
        // Messages module - only active if there are any messages
        const hasMessages = reqs.some(req => req.message && typeof req.message === 'string' && req.message.trim() !== '');
        const messagesModule = updatedModules.find(m => m.id === 'messages')!;
        messagesModule.isActive = hasMessages; // Only show if there are messages
        
        // Upcoming photoshoot module - always active, even if empty
        const hasUpcomingPhotoshoot = shoots.length > 0;
        const photoshootModule = updatedModules.find(m => m.id === 'upcomingPhotoshoot')!;
        photoshootModule.isActive = true; // Always show, even if empty
        
        // Performance chart module - always active, even if empty
        const hasPerformanceData = props.length > 0 || stats.viewsCount > 0 || stats.inquiriesCount > 0;
        const performanceModule = updatedModules.find(m => m.id === 'performanceChart')!;
        performanceModule.isActive = true; // Always show, even if empty
        
        // Dynamic priority adjustment - modules with content get higher priority
        // First, reset all modules to their base priority
        latestRequestModule.priority = hasLatestRequest ? 1 : 10;
        messagesModule.priority = hasMessages ? 3 : 13; // Only matters if there are messages
        photoshootModule.priority = hasUpcomingPhotoshoot ? 2 : 11;
        performanceModule.priority = hasPerformanceData ? 4 : 12;
        
        // Sort modules by priority - lower numbers come first
        updatedModules.sort((a, b) => a.priority - b.priority);
        
        setDashboardModules(updatedModules);
    }, [dashboardModules]);
    
    // Initial data load
    useEffect(() => {
        loadData();
        
        // Set up real-time updates
        const intervalId = setInterval(() => {
            loadData(false); // Don't show loading indicator for background updates
        }, REAL_TIME_UPDATE_INTERVAL);
        
        // Clean up interval on unmount
        return () => clearInterval(intervalId);
    }, [loadData]);
    
    // Get current locale for date formatting
    const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    
    // Prepare property data for chart with real metrics
    const propertyDataForChart = properties.map(property => {
        const propertyRequests = requests.filter(req => req.propertyId === property.id);
        
        // Calculate this month's views
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        
        // Find requests from the current month
        const thisMonthViews = propertyRequests.filter(req => {
            const reqDate = new Date(req.createdAt);
            return reqDate.getMonth() === thisMonth && reqDate.getFullYear() === thisYear;
        }).length;
        
        // Find requests from the previous month
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
        
        const lastMonthViews = propertyRequests.filter(req => {
            const reqDate = new Date(req.createdAt);
            return reqDate.getMonth() === lastMonth && reqDate.getFullYear() === lastMonthYear;
        }).length;
        
        // Determine trend
        const trend = thisMonthViews >= lastMonthViews ? 'up' as const : 'down' as const;
        
        return {
            propertyName: property.title,
            propertyImage: property.images[0] || '',
            trend: trend,
            thisMonth: thisMonthViews.toString(),
            lastMonth: lastMonthViews.toString(),
            clicks: (property.clickCount || 0).toString(),
            requests: propertyRequests.length.toString(),
            listedOn: property ? new Date(property.createdAt).toLocaleDateString(locale, {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) : t('advertiser_dashboard.dashboard.not_listed'),
            views: (property.viewCount || 0).toString()
        };
    });
    
    // Get latest request if available (only show if not accepted)
    const latestReservationRequest = reservationRequests.length > 0 
        ? reservationRequests
            .filter(req => req.reservation.status === 'pending')
            .sort((a, b) => new Date(b.reservation.createdAt).getTime() - new Date(a.reservation.createdAt).getTime())[0] 
        : null;
    
    // Get next upcoming photoshoot (don't filter by status, show any photoshoot)
    const upcomingPhotoshoot = photoshoots.length > 0 
        ? photoshoots
            .filter(photoshoot => {
                // Make sure we have a valid date
                if (!photoshoot.date) return false;
                
                // Convert to Date object if it's not already
                const photoshootDate = photoshoot.date instanceof Date 
                    ? photoshoot.date 
                    : new Date(photoshoot.date);
                
                // Check if date is valid
                if (isNaN(photoshootDate.getTime())) return false;
                
                // Only include photoshoots that haven't been completed or cancelled
                return photoshoot.status !== 'completed' && photoshoot.status !== 'cancelled';
            })
            .sort((a, b) => {
                const dateA = a.date instanceof Date ? a.date : new Date(a.date);
                const dateB = b.date instanceof Date ? b.date : new Date(b.date);
                return dateA.getTime() - dateB.getTime();
            })[0]
        : null;
    
    // Find the property associated with the upcoming photoshoot
    const photoshootProperty = upcomingPhotoshoot 
        ? properties.find(p => p.id === upcomingPhotoshoot.propertyId)
        : null;
    
    // Empty state helpers
    const hasMessages = requests.some(req => req.message && typeof req.message === 'string' && req.message.trim() !== '');
    const hasStats = propertyDataForChart.some(p => Number(p.views) > 0 || Number(p.clicks) > 0 || Number(p.requests) > 0);
    const hasProperties = properties.length > 0 && propertyDataForChart.some(p => Number(p.views) > 0);
    const hasPerformanceData = properties.length > 0 || statistics.viewsCount > 0 || statistics.inquiriesCount > 0;
    
    // Check if any properties need availability refresh
    const propertiesNeedingRefresh = countPropertiesNeedingRefresh(properties);
    const shouldShowRefreshReminder = propertiesNeedingRefresh > 0;
    
    // Check if advertiser has ever booked a photoshoot before
    const hasBookedPhotoshoot = photoshoots.length > 0;
    
    // Handler functions for photoshoot requests
    const handleViewPhotoshootDetails = (requestId: string) => {
        navigate(`/dashboard/advertiser/photoshoot/view/${requestId}`);
    };
    
    const handleCancelPhotoshootRequest = (requestId: string) => {
        // This would be implemented with a real API call
        console.log('Cancel photoshoot request:', requestId);
        // Show a confirmation dialog and then call the API
        navigate(`/dashboard/advertiser/photoshoot`);
    };
    
    const handleBookPhotoshoot = () => {
        navigate('/photoshoot-booking');
    };

    // Auto-complete checklist items based on data
    useEffect(() => {
        // Create a local copy of completion status to avoid multiple updates
        const completionStatus = {
            bookPhotoshoot: isItemCompleted('book_photoshoot'),
            completeProfile: isItemCompleted('complete_profile'),
            refreshAvailability: isItemCompleted('refresh_availability'),
            addPayoutMethod: isItemCompleted('add_payout_method'),
            acceptBooking: isItemCompleted('accept_booking'),
            messageTenant: isItemCompleted('message_tenant')
        };

        // Check if photoshoot is booked - any photoshoots (not just scheduled ones) should mark this as completed
        if (photoshoots.length > 0 && !completionStatus.bookPhotoshoot) {
            console.log('Marking book_photoshoot as completed because photoshoots exist:', photoshoots);
            completeItem('book_photoshoot');
        }
        
        // Check if profile is completed (simplified check - in real app would be more comprehensive)
        if (extendedUser?.name && extendedUser?.email && extendedUser?.phone && !completionStatus.completeProfile) {
            completeItem('complete_profile');
        }
        
        // Check if availability has been refreshed recently (within last 30 days)
        // Only complete if user has properties and none need refreshing
        if (properties.length > 0 && !shouldShowRefreshReminder && !completionStatus.refreshAvailability) {
            completeItem('refresh_availability');
        }
        
        // Check if user has a payment method added (simplified check)
        if (extendedUser?.paymentMethods && extendedUser.paymentMethods.length > 0 && !completionStatus.addPayoutMethod) {
            completeItem('add_payout_method');
        }
        
        // Check if user has accepted a booking (simplified check)
        const hasAcceptedBooking = reservationRequests.some(req => req.reservation.status === 'accepted');
        if (hasAcceptedBooking && !completionStatus.acceptBooking) {
            completeItem('accept_booking');
        }
        
        // Check if user has messaged a tenant (simplified check)
        const hasSentMessage = requests.some(req => req.message && req.message.trim() !== '');
        if (hasSentMessage && !completionStatus.messageTenant) {
            completeItem('message_tenant');
        }
    }, [
        hasBookedPhotoshoot, 
        extendedUser, 
        shouldShowRefreshReminder, 
        reservationRequests, 
        requests, 
        completeItem,
        isItemCompleted,
        photoshoots,
        properties
    ]);



    // Render modules in priority order
    const renderDashboardModules = () => {
        // Always show the listing guide if advertiser has never booked a photoshoot
        // AND it's the next available step in the checklist
        if (!hasBookedPhotoshoot && isItemClickable('book_photoshoot')) {
            return (
                <>
                    <ListingGuideCard onBookPhotoshoot={() => navigate('/photoshoot-booking')} />
                    {renderPrioritizedModules()}
                </>
            );
        }
        
        return renderPrioritizedModules();
    };
    
    // Render modules based on priority and active status
    const renderPrioritizedModules = () => {
        // Log the current module order for debugging
        console.log('Rendering modules in order:', 
            dashboardModules
                .filter(module => module.isActive)
                .map(m => ({ id: m.id, priority: m.priority }))
        );
        
        return dashboardModules
            .filter(module => module.isActive)
            .map(module => {
                switch(module.id) {
                    case 'latestRequest':
                        return renderLatestRequestModule();
                    case 'messages':
                        // Messages are only shown if they exist (controlled by isActive flag)
                        return (
                            <div key="messages">
                                <MessagesCard 
                                    title={t('advertiser_dashboard.dashboard.messages')}
                                    name={latestReservationRequest?.client 
                                        ? `${latestReservationRequest.client.name || ''} ${latestReservationRequest.client.surname || ''}`.trim() 
                                        : extendedUser?.name || t('advertiser_dashboard.dashboard.user')}
                                    img={latestReservationRequest?.client?.profilePicture || extendedUser?.profilePicture || ''}
                                    messageCount={requests.length}
                                    message={latestReservationRequest && typeof latestReservationRequest.reservation.message === 'string' 
                                        ? latestReservationRequest.reservation.message 
                                        : t('advertiser_dashboard.dashboard.no_messages')}
                                    onViewMore={() => navigate('/dashboard/advertiser/messages')}
                                />
                            </div>
                        );
                    case 'upcomingPhotoshoot':
                        return (
                            <div key="photoshoot">
                                {upcomingPhotoshoot ? (
                                    <PhotoshootStatusCard 
                                        photoshootId={upcomingPhotoshoot.id}
                                        propertyLocation={photoshootProperty 
                                            ? `${photoshootProperty.address.street}, ${photoshootProperty.address.city}`
                                            : upcomingPhotoshoot.streetName 
                                              ? `${upcomingPhotoshoot.streetName}, ${upcomingPhotoshoot.city || ''}`
                                              : t('advertiser_dashboard.photoshoot.property_address')}
                                        scheduledDate={upcomingPhotoshoot.date instanceof Date ? upcomingPhotoshoot.date : new Date(upcomingPhotoshoot.date)}
                                        timeSlot={upcomingPhotoshoot.timeSlot || upcomingPhotoshoot.time || "10:00 AM - 12:00 PM"}
                                        status={upcomingPhotoshoot.status === 'scheduled' ? 'assigned' : upcomingPhotoshoot.status}
                                        photographerName={upcomingPhotoshoot.photographerName || t('advertiser_dashboard.photoshoot.photographer_team', 'Kaari Photography Team')}
                                        photographerInfo={upcomingPhotoshoot.photographerInfo || t('advertiser_dashboard.photoshoot.professional_photographer', 'Professional Photographer')}
                                        photographerImage={upcomingPhotoshoot.photographerImage || profile}
                                        phoneNumber={upcomingPhotoshoot.phoneNumber || "+1234567890"}
                                        number={statistics.photoshootsScheduled}
                                        onReschedule={() => navigate('/dashboard/advertiser/photoshoot')}
                                        onCancel={() => navigate('/dashboard/advertiser/photoshoot')}
                                    />
                                ) : (
                                    <div className="empty-module">
                                        <h3>{t('advertiser_dashboard.dashboard.upcoming_photoshoot')}</h3>
                                        <div className="empty-state">
                                            <img src={emptyBox} alt="No upcoming photoshoot" />
                                            <div className="title">{t('advertiser_dashboard.dashboard.no_upcoming_photoshoot', 'No upcoming photoshoot')}</div>
                                            <div className="description">{t('advertiser_dashboard.dashboard.no_upcoming_photoshoot_hint', 'Book a photoshoot to start getting views')}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    case 'performanceChart':
                        return (
                            <div key="performance">
                                {hasPerformanceData ? (
                                    <PerformanceChart 
                                        title={t('advertiser_dashboard.dashboard.performance_overview')} 
                                        viewCount={statistics.viewsCount}
                                        inquiryCount={statistics.inquiriesCount}
                                        bookingCount={statistics.pendingReservations}
                                        loading={loading}
                                    />
                                ) : !loading && (
                                    <div className="empty-module">
                                        <h3>{t('advertiser_dashboard.dashboard.performance_overview')}</h3>
                                        <div className="empty-state">
                                            <img src={emptyBox} alt="No performance data" />
                                            <div className="title">{t('advertiser_dashboard.dashboard.no_performance_data', 'No performance data yet')}</div>
                                            <div className="description">{t('advertiser_dashboard.dashboard.no_performance_data_hint', 'List your property to start seeing performance metrics')}</div>
                                        </div>
                                    </div>
                                )}

                                <div className="section-spacer">
                                    <div className="scroll-x">
                                {hasProperties ? (
                                        <PropertyViewsTable 
                                            title={t('advertiser_dashboard.dashboard.views_of_properties', 'Views of Properties')}
                                            properties={propertyDataForChart.map(p => ({
                                                id: p.propertyName,
                                                name: p.propertyName,
                                                image: p.propertyImage,
                                                thisMonth: parseInt(p.thisMonth) || 0,
                                                lastMonth: parseInt(p.lastMonth) || 0,
                                                clicks: parseInt(p.clicks) || 0,
                                                requests: parseInt(p.requests) || 0,
                                                listedOn: p.listedOn,
                                                totalViews: parseInt(p.views) || 0
                                            }))}
                                            totalViews={statistics.viewsCount}
                                            loading={loading}
                                        />
                                ) : !loading && (
                                    <PropertyViewsTable 
                                            title={t('advertiser_dashboard.dashboard.views_of_properties', 'Views of Properties')}
                                            properties={propertyDataForChart.map(p => ({
                                                id: p.propertyName,
                                                name: p.propertyName,
                                                image: p.propertyImage,
                                                thisMonth: parseInt(p.thisMonth) || 0,
                                                lastMonth: parseInt(p.lastMonth) || 0,
                                                clicks: parseInt(p.clicks) || 0,
                                                requests: parseInt(p.requests) || 0,
                                                listedOn: p.listedOn,
                                                totalViews: parseInt(p.views) || 0
                                            }))}
                                            totalViews={statistics.viewsCount}
                                            loading={loading}
                                        />
                                )}
                                    </div>
                                </div>
                            </div>
                        );
                    default:
                        return null;
                }
            });
    };
    
    // Render the latest request module (always show, but with empty state if needed)
    const renderLatestRequestModule = () => {
        return (
            <div key="latestRequest">
                {latestReservationRequest ? (
                    <LatestRequestDashboardCard 
                        title={t('advertiser_dashboard.dashboard.latest_request')}
                        requestImage={latestReservationRequest.property?.images[0] || ''}
                        requestTitle={latestReservationRequest.property?.title || t('advertiser_dashboard.dashboard.property_request')}
                        name={latestReservationRequest.client 
                            ? `${latestReservationRequest.client.name || ''} ${latestReservationRequest.client.surname || ''}`.trim() 
                            : t('advertiser_dashboard.dashboard.anonymous_user')}
                        img={latestReservationRequest.client?.profilePicture || ''}
                        date={latestReservationRequest.reservation.createdAt ? format(new Date(latestReservationRequest.reservation.createdAt), 'MMM dd, yyyy') : format(new Date(), 'MMM dd, yyyy')}
                        time={latestReservationRequest.reservation.createdAt ? new Date(latestReservationRequest.reservation.createdAt).toLocaleTimeString() : '13:35'}
                        moveInDate={latestReservationRequest.reservation.moveInDate ? format(new Date(latestReservationRequest.reservation.moveInDate), 'MMM dd, yyyy') : format(new Date(new Date().setDate(new Date().getDate() + 15)), 'MMM dd, yyyy')}
                        appliedOn={latestReservationRequest.reservation.createdAt ? format(new Date(latestReservationRequest.reservation.createdAt), 'MMM dd, yyyy') : format(new Date(), 'MMM dd, yyyy')}
                        photographerInfo={latestReservationRequest.reservation.numPeople 
                            ? t('advertiser_dashboard.dashboard.occupants', 'Occupants: {{count}}', { count: Number(latestReservationRequest.reservation.numPeople) })
                            : undefined}
                        requestCount={statistics.inquiriesCount}
                        requestStatus={latestReservationRequest.reservation.status}
                        onDetails={() => navigate('/dashboard/advertiser/reservations')}
                        onViewMore={() => navigate('/dashboard/advertiser/reservations')}
                        onAccept={() => navigate('/dashboard/advertiser/reservations')}
                        onReject={() => navigate('/dashboard/advertiser/reservations')}
                    />
                ) : (
                    <LatestRequestDashboardCard 
                        title={t('advertiser_dashboard.dashboard.latest_request')}
                        isEmpty={true}
                        onViewMore={() => navigate('/dashboard/advertiser/reservations')}
                        onBrowseProperties={() => navigate('/properties')}
                    />
                )}
            </div>
        );
    };

    return (
        <DashboardPageStyle>
            <div className="left">
                {/* Referral Banner - Always visible */}
                <ReferralBanner />
                
                {/* Downgrade banner if flagged by system */}
                {(user as any)?.downgradeBanner?.type === 'broker_to_landlord' && (
                    <div style={{
                        background: '#FFF3CD',
                        color: '#856404',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        border: '1px solid #FFEEBA'
                    }}>
                        Your account was downgraded to Landlord due to low activity (&lt; 3 active listings in 60 days). If this is a mistake, contact support.
                    </div>
                )}

                {/* Free Photoshoot Banner - Only visible if no photoshoots */}
                {showFreePhotoshootBanner && (
                    <FreePhotoshootBanner />
                )}
                
                {/* Dynamic dashboard modules */}
                {renderDashboardModules()}
            </div>
            <div className="right">
                {/* Getting Started Checklist - New Component */}
                <GettingStartedChecklist 
                    items={checklistItems}
                    onCompleteItem={completeItem}
                    isItemClickable={isItemClickable}
                    getItemVisibility={getItemVisibility}
                />
                
                {/* Book a Photoshoot Card - Only show if it's the next available step */}
                {!hasBookedPhotoshoot && isItemClickable('book_photoshoot') && (
                    <BookAPhotoshootComponent 
                        onBookPhotoshoot={() => navigate('/photoshoot-booking')}
                    />
                )}
                
                {/* Properties Refresh Reminder - Only show if it's the next available step */}
                {shouldShowRefreshReminder && isItemClickable('refresh_availability') && (
                    <UpToDateCardComponent 
                        count={propertiesNeedingRefresh} 
                        onRefresh={() => navigate('/dashboard/advertiser/properties')}
                    />
                )}
            </div>
        </DashboardPageStyle>
    );
};

export default DashboardPage;
