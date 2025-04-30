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
    getAdvertiserListings, 
    getAdvertiserRequests, 
    getAdvertiserPhotoshoots,
    Photoshoot,
    Request
} from '../../../../backend/server-actions/AdvertiserServerActions';
import { useStore } from '../../../../backend/store';
import { Property, Listing } from '../../../../backend/entities';
import { useTranslation } from 'react-i18next';


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
    const [listings, setListings] = useState<Listing[]>([]);
    const [requests, setRequests] = useState<Request[]>([]);
    const [photoshoots, setPhotoshoots] = useState<Photoshoot[]>([]);
    
    useEffect(() => {
        // Load data when component mounts
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch statistics, properties, listings, requests, and photoshoots in parallel
                const [stats, props, lists, reqs, shoots] = await Promise.all([
                    getAdvertiserStatistics(),
                    getAdvertiserProperties(),
                    getAdvertiserListings(),
                    getAdvertiserRequests(),
                    getAdvertiserPhotoshoots()
                ]);
                
                setStatistics(stats);
                setProperties(props);
                setListings(lists);
                setRequests(reqs);
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
        const listingForProperty = listings.find(listing => listing.propertyId === property.id);
        const propertyRequests = requests.filter(req => req.propertyId === property.id || req.listingId === listingForProperty?.id);
        
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
            clicks: (listingForProperty?.contactCount || 0).toString(),
            requests: propertyRequests.length.toString(),
            listedOn: listingForProperty ? new Date(listingForProperty.createdAt).toLocaleDateString(locale, {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) : t('advertiser_dashboard.dashboard.not_listed'),
            views: (listingForProperty?.viewCount || 0).toString()
        };
    });
    
    // Get latest request if available (only show if not accepted)
    const latestRequest = requests.length > 0 
        ? requests
            .filter(req => req.status !== 'accepted')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] 
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

    // Prepare property data for chart with real metrics
    // (Assume you have a function to aggregate chart data, here is a simple example)
    const chartData = [];
    // Example: aggregate by week or day, or use propertyDataForChart as needed
    // chartData = [{ date: '1 Apr', views: 0, clicks: 0, bookings: 0 }, ...]
    // For now, just pass an empty array to trigger the empty state

    return (
        <DashboardPageStyle>
            <div className="left">
                <PerformanceChart 
                    title={t('advertiser_dashboard.dashboard.performance_overview')} 
                    viewCount={statistics.viewsCount}
                    inquiryCount={statistics.inquiriesCount}
                    bookingCount={statistics.pendingReservations}
                    loading={loading}
                    data={chartData}
                />
                {/* Listing Performance Empty State removed, handled inside PerformanceChart */}
                {latestRequest && (
                    <LatestRequestDashboardCard 
                        title={t('advertiser_dashboard.dashboard.latest_request')}
                        name={typeof latestRequest.message === 'string' 
                            ? latestRequest.message.substring(0, 20) + (latestRequest.message.length > 20 ? '...' : '') 
                            : t('advertiser_dashboard.dashboard.new_request')}
                        img={user?.profilePicture || ''}
                        date={new Date(latestRequest.createdAt).toLocaleDateString(locale, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                        time={new Date(latestRequest.createdAt).toLocaleTimeString(locale, {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        requestCount={statistics.inquiriesCount}
                    />
                )}
                {/* Messages Section with Empty State */}
                <div style={{ margin: '24px 0' }}>
                    {hasMessages ? (
                        <MessagesCard 
                            title={t('advertiser_dashboard.dashboard.messages')}
                            name={user?.name || t('advertiser_dashboard.dashboard.user')}
                            img={user?.profilePicture || ''}
                            messageCount={requests.length}
                            message={latestRequest && typeof latestRequest.message === 'string' 
                                ? latestRequest.message 
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
                    incomeAmount={`${t('advertiser_dashboard.payments.currency', '$')}${listings.reduce((sum, listing) => sum + listing.price, 0).toLocaleString()}`}
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
