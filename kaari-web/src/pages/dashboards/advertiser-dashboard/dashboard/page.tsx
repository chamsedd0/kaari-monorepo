import React, { useEffect, useState } from 'react';
import { DashboardPageStyle } from './styles';
import UpcomingPhotoshoot from '../../../../components/skeletons/cards/upcoming-photoshoot';
import LatestRequestDashboardCard from '../../../../components/skeletons/cards/lateest-request-dashboard-card';
import MessagesCard from '../../../../components/skeletons/cards/messages-card';
import BookAPhotoshootComponent from '../../../../components/skeletons/cards/book-a-photoshoot-card';
import PaymentCardComponent from '../../../../components/skeletons/cards/payment-card';
import { PerformanceChart } from '../../../../components/skeletons/constructed/chart/performance-chart';
import UpToDateCardComponent from '../../../../components/skeletons/cards/up-to-date-card';
import emptyBox from '../../../../assets/images/emptybox.svg';
import { useNavigate } from 'react-router-dom';
import { 
    getAdvertiserStatistics, 
    getAdvertiserProperties, 
    getAdvertiserRequests,
    getAdvertiserReservationRequests,
    getAdvertiserPhotoshoots,
    Photoshoot,
   
} from '../../../../backend/server-actions/AdvertiserServerActions';
import { useStore } from '../../../../backend/store';
import { Property, Request } from '../../../../backend/entities';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';


const DashboardPage: React.FC = () => {
    const { user } = useStore();
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
    const [properties, setProperties] = useState<Property[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [photoshoots, setPhotoshoots] = useState<Photoshoot[]>([]);
    const [reservationRequests, setReservationRequests] = useState<{
        reservation: Request;
        listing?: any;
        property?: any;
        client?: any;
    }[]>([]);
    
    useEffect(() => {
        // Load data when component mounts
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch statistics, properties, listings, requests, and photoshoots in parallel
                const [props, reqs, reservationReqs, shoots] = await Promise.all([
                    getAdvertiserProperties(),
                    getAdvertiserRequests(),
                    getAdvertiserReservationRequests(),
                    getAdvertiserPhotoshoots()
                ]);
                
                setProperties(props);
                setRequests(reqs);
                setReservationRequests(reservationReqs);
                setPhotoshoots(shoots);
            } catch (error) {
                console.error(t('advertiser_dashboard.dashboard.errors.loading_data', 'Error loading dashboard data:'), error);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [user?.id, t]);
    
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
            clicks: (0).toString(),
            requests: propertyRequests.length.toString(),
            listedOn: property ? new Date(property.createdAt).toLocaleDateString(locale, {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) : t('advertiser_dashboard.dashboard.not_listed'),
            views: (0).toString()
        };
    });
    
    // Get latest request if available (only show if not accepted)
    const latestReservationRequest = reservationRequests.length > 0 
        ? reservationRequests
            .filter(req => req.reservation.status === 'pending')
            .sort((a, b) => new Date(b.reservation.createdAt).getTime() - new Date(a.reservation.createdAt).getTime())[0] 
        : null;
    
    // Get next upcoming photoshoot
    const upcomingPhotoshoot = photoshoots.length > 0 
        ? photoshoots
            .filter(p => p.status === 'scheduled')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
        : null;
    
    // Find the property associated with the upcoming photoshoot
    const photoshootProperty = upcomingPhotoshoot 
        ? properties.find(p => p.id === upcomingPhotoshoot.propertyId)
        : null;
    
    // Empty state helpers
    const hasMessages = requests.some(req => req.message && typeof req.message === 'string' && req.message.trim() !== '');
    const hasStats = propertyDataForChart.some(p => Number(p.views) > 0 || Number(p.clicks) > 0 || Number(p.requests) > 0);
    const hasProperties = properties.length > 0 && propertyDataForChart.some(p => Number(p.views) > 0);



    return (
        <DashboardPageStyle>
            <div className="left">
                <PerformanceChart 
                    title={t('advertiser_dashboard.dashboard.performance_overview')} 
                    viewCount={statistics.viewsCount}
                    inquiryCount={statistics.inquiriesCount}
                    bookingCount={statistics.pendingReservations}
                    loading={loading}
                />
                {latestReservationRequest ? (
                    <LatestRequestDashboardCard 
                        title={t('advertiser_dashboard.dashboard.latest_request')}
                        requestImage={latestReservationRequest.property?.images[0] || ''}
                        requestTitle={latestReservationRequest.property?.title || t('advertiser_dashboard.dashboard.property_request')}
                        name={latestReservationRequest.client 
                            ? `${latestReservationRequest.client.name || ''} ${latestReservationRequest.client.surname || ''}`.trim() 
                            : t('advertiser_dashboard.dashboard.anonymous_user')}
                        img={latestReservationRequest.client?.profilePicture || ''}
                        date={format(new Date(), 'MMM dd, yyyy')}
                        time={'13:35'}
                        moveInDate={format(new Date(new Date().setDate(new Date().getDate() + 15)), 'MMM dd, yyyy')}
                        appliedOn={format(new Date(), 'MMM dd, yyyy')}
                        photographerInfo={latestReservationRequest.reservation.numPeople 
                            ? t('advertiser_dashboard.dashboard.occupants', 'Occupants: {{count}}', { count: Number(latestReservationRequest.reservation.numPeople) })
                            : undefined}
                        requestCount={statistics.inquiriesCount}
                        requestStatus={latestReservationRequest.reservation.status}
                        onDetails={() => navigate('/dashboard/advertiser/reservations')}
                        onViewMore={() => navigate('/dashboard/advertiser/reservations')}
                        onAccept={() => {
                            // Handle accepting the reservation request
                            navigate('/dashboard/advertiser/reservations');
                        }}
                        onReject={() => {
                            // Handle rejecting the reservation request
                            navigate('/dashboard/advertiser/reservations');
                        }}
                    />
                ) : (
                    <LatestRequestDashboardCard 
                        title={t('advertiser_dashboard.dashboard.latest_request')}
                        isEmpty={true}
                        onViewMore={() => navigate('/dashboard/advertiser/reservations')}
                        onBrowseProperties={() => navigate('/properties')}
                    />
                )}
                {/* Messages Section with Empty State */}
                <div style={{ margin: '24px 0' }}>
                    {hasMessages ? (
                        <MessagesCard 
                            title={t('advertiser_dashboard.dashboard.messages')}
                            name={latestReservationRequest?.client 
                                ? `${latestReservationRequest.client.name || ''} ${latestReservationRequest.client.surname || ''}`.trim() 
                                : user?.name || t('advertiser_dashboard.dashboard.user')}
                            img={latestReservationRequest?.client?.profilePicture || user?.profilePicture || ''}
                            messageCount={requests.length}
                            message={latestReservationRequest && typeof latestReservationRequest.reservation.message === 'string' 
                                ? latestReservationRequest.reservation.message 
                                : t('advertiser_dashboard.dashboard.no_messages')}
                            onViewMore={() => {
                                navigate('/dashboard/advertiser/messages');
                            }}
                        />
                    ) : !loading && (
                        <div style={{ background: '#fff', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                            <img src={emptyBox} alt="No messages" style={{ width: 80, marginBottom: 12 }} />
                            <div style={{ color: '#888', fontSize: 16, marginTop: 8 }}>{t('advertiser_dashboard.dashboard.no_messages', 'You have no messages yet')}</div>
                            <div style={{ color: '#aaa', fontSize: 14, marginTop: 4 }}>{t('advertiser_dashboard.dashboard.no_messages_hint', 'You will receive your messages once your tenants will start texting you')}</div>
                        </div>
                    )}
                </div>
                {/* Views of Properties Section with Empty State */}
                <div style={{ margin: '24px 0' }}>
                    {hasProperties ? (
                        <PerformanceChart 
                            title={t('advertiser_dashboard.dashboard.views_of_properties', 'Views of Properties')}
                            viewCount={statistics.viewsCount}
                            inquiryCount={statistics.inquiriesCount}
                            bookingCount={statistics.pendingReservations}
                            loading={loading}
                        />
                    ) : !loading && (
                        <div style={{ background: '#fff', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                            <img src={emptyBox} alt="No views" style={{ width: 80, marginBottom: 12 }} />
                            <div style={{ color: '#888', fontSize: 16, marginTop: 8 }}>{t('advertiser_dashboard.dashboard.no_views', 'You have no views yet')}</div>
                            <div style={{ color: '#aaa', fontSize: 14, marginTop: 4 }}>{t('advertiser_dashboard.dashboard.no_views_hint', 'List your property by booking a photoshoot and start getting views')}</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="right">

                
                {upcomingPhotoshoot && photoshootProperty ? (
                    <UpcomingPhotoshoot 
                        date={new Date(upcomingPhotoshoot.date).toLocaleDateString(locale, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                        time={upcomingPhotoshoot.time}
                        photographerName={upcomingPhotoshoot.photographerName || t('advertiser_dashboard.photoshoot.photographer_team')}
                        photographerInfo={upcomingPhotoshoot.photographerInfo || t('advertiser_dashboard.photoshoot.professional_photographer')}
                        photographerImage={upcomingPhotoshoot.photographerImage || ''}
                        location={`${photoshootProperty.address.street}, ${photoshootProperty.address.city}`}
                        number={statistics.photoshootsScheduled}
                    />
                ) : (
                    <BookAPhotoshootComponent />
                )}
                
                <PaymentCardComponent 
                    incomeAmount={`${t('advertiser_dashboard.payments.currency', '$')}${properties.reduce((sum, property) => sum + property.price, 0).toLocaleString()}`}
                    infoItems={[
                        { title: t('advertiser_dashboard.dashboard.active_listings'), number: statistics.activeListings.toString() },
                        { title: t('advertiser_dashboard.dashboard.properties'), number: statistics.totalProperties.toString() }
                    ]}
                    onViewMore={() => {
                        navigate('/dashboard/advertiser/payments');
                    }}
                />
                <UpToDateCardComponent onClick={() => {
                    navigate('/dashboard/advertiser/properties');
                }} />
                
            </div>
        </DashboardPageStyle>
    );
};

export default DashboardPage;
