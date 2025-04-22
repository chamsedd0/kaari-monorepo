import React, { useEffect, useState } from 'react';
import { DashboardPageStyle } from './styles';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import UpcomingPhotoshoot from '../../../../components/skeletons/cards/upcoming-photoshoot';
import LatestRequestDashboardCard from '../../../../components/skeletons/cards/lateest-request-dashboard-card';
import MessagesCard from '../../../../components/skeletons/cards/messages-card';
import BookAPhotoshootComponent from '../../../../components/skeletons/cards/book-a-photoshoot-card';
import PaymentCardComponent from '../../../../components/skeletons/cards/payment-card';
import { PerformanceChart } from '../../../../components/skeletons/constructed/chart/performance-chart';
import UpToDateCardComponent from '../../../../components/skeletons/cards/up-to-date-card';
import PropertiesGraphCardComponent from '../../../../components/skeletons/cards/properties-garph-card';
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
import { getDocumentsByField, getDocumentById } from '../../../../backend/firebase/firestore';

const DashboardPage: React.FC = () => {
    const { user } = useStore();
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
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [user?.id]);
    
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
            listedOn: listingForProperty ? new Date(listingForProperty.createdAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) : 'Not listed',
            views: (listingForProperty?.viewCount || 0).toString()
        };
    });
    
    // Get latest request if available
    const latestRequest = requests.length > 0 
        ? requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] 
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
    
    return (
        <DashboardPageStyle>
            <div className="left">
                <PerformanceChart 
                    title="Performance Overview" 
                    viewCount={statistics.viewsCount}
                    inquiryCount={statistics.inquiriesCount}
                    bookingCount={statistics.pendingReservations}
                    loading={loading}
                />
                {latestRequest && (
                    <LatestRequestDashboardCard 
                        title="Latest Request"
                        name={latestRequest.message.substring(0, 20) + (latestRequest.message.length > 20 ? '...' : '')}
                        img={user?.profilePicture || ''}
                        date={new Date(latestRequest.createdAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                        time={new Date(latestRequest.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        requestCount={statistics.inquiriesCount}
                    />
                )}
                <MessagesCard 
                    title="Messages"
                    name={user?.name || 'User'}
                    img={user?.profilePicture || ''}
                    messageCount={requests.length}
                    message={latestRequest?.message || 'No messages yet'}
                />
            </div>
            <div className="right">

                
                {upcomingPhotoshoot && photoshootProperty ? (
                    <UpcomingPhotoshoot 
                        date={new Date(upcomingPhotoshoot.date).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                        time={upcomingPhotoshoot.time}
                        photographerName={upcomingPhotoshoot.photographerName}
                        photographerInfo={upcomingPhotoshoot.photographerInfo}
                        photographerImage={upcomingPhotoshoot.photographerImage}
                        location={`${photoshootProperty.address.street}, ${photoshootProperty.address.city}`}
                        number={statistics.photoshootsScheduled}
                    />
                ) : (
                    <BookAPhotoshootComponent />
                )}
                
                <PaymentCardComponent 
                    incomeAmount={`$${listings.reduce((sum, listing) => sum + listing.price, 0).toLocaleString()}`}
                    infoItems={[
                        { title: "Active Listings", number: statistics.activeListings.toString() },
                        { title: "Properties", number: statistics.totalProperties.toString() }
                    ]}
                    onViewMore={() => {}}
                />
                <UpToDateCardComponent />
                <NeedHelpCardComponent 
                    title="Need Help?" 
                    faqItems={[
                        { question: "How can I add a new property?", onClick: () => {} },
                        { question: "How to respond to a booking request?", onClick: () => {} },
                        { question: "How to book a new photoshoot?", onClick: () => {} }
                    ]}
                />
            </div>
        </DashboardPageStyle>
    );
};

export default DashboardPage;
