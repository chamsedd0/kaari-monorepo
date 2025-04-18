import React, { useState, useEffect } from 'react';
import { NavigationPannel } from '../../../components/skeletons/constructed/dashboard-navigation-pannel/navigation-pannel';
import UnifiedHeader from '../../../components/skeletons/constructed/headers/unified-header';
import { AdminDashboardStyle } from './styles';
import { ReservationsTable } from '../../../components/reservations/ReservationsTable';
import LatestRequestCard from '../../../components/skeletons/cards/latest-request-card';
import LoadingScreen from '../../../components/loading/LoadingScreen';

type Section = 'profile' | 'messages' | 'reservations' | 'reviews' | 'payments' | 'perks' | 'settings' | 'contacts' | 'faq';

const AdminDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>('reservations');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSectionLoading, setIsSectionLoading] = useState(false);

    // Initial loading when the dashboard first loads
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // Show loading screen for 1.5 seconds
        
        return () => clearTimeout(timer);
    }, []);

    // Loading when switching between sections
    useEffect(() => {
        if (isLoading) return; // Skip if initial loading is still happening
        
        setIsSectionLoading(true);
        setIsAnimating(true);
        
        const animationTimer = setTimeout(() => {
            setIsAnimating(false);
        }, 300);
        
        const loadingTimer = setTimeout(() => {
            setIsSectionLoading(false);
        }, 800); // Show section loading for 800ms
        
        return () => {
            clearTimeout(animationTimer);
            clearTimeout(loadingTimer);
        };
    }, [activeSection, isLoading]);

    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div>
                        <h1 className="section-title">Admin Profile</h1>
                        <div className="profile-content">
                            <p>Admin profile information will appear here.</p>
                        </div>
                    </div>
                );
            case 'messages':
                return (
                    <div>
                        <h1 className="section-title">Messages</h1>
                        <div className="messages-content">
                            <p>Admin messages will appear here.</p>
                        </div>
                    </div>
                );
            case 'reservations':
                return (
                    <div>
                        <h1 className="section-title">Reservations</h1>
                        <div className="pending-requests">
                            <div className="request-card">
                                <LatestRequestCard  
                                    title="Apartment - " 
                                    price="1000 per Night" 
                                    date='11.12.2024'  
                                    timer={true} 
                                    details="flat in the center of Agadir" 
                                    status="Pending" 
                                    image="https://via.placeholder.com/150" 
                                />
                            </div>
                            <div className="request-card">
                                <LatestRequestCard 
                                    title="Latest Request 2" 
                                    status="Approved" 
                                    price="1000 per Night" 
                                    date='11.12.2024'  
                                    details="flat in the center of Agadir" 
                                    image="https://via.placeholder.com/150" 
                                />
                            </div>
                        </div>
                        <ReservationsTable />
                    </div>
                );
            case 'reviews':
                return (
                    <div>
                        <h1 className="section-title">Reviews</h1>
                        <div className="reviews-content">
                            <p>Admin reviews will appear here.</p>
                        </div>
                    </div>
                );
            case 'payments':
                return (
                    <div>
                        <h1 className="section-title">Payments</h1>
                        <div className="payments-content">
                            <p>Admin payment information will appear here.</p>
                        </div>
                    </div>
                );
            case 'perks':
                return (
                    <div>
                        <h1 className="section-title">Perks Program</h1>
                        <div className="perks-content">
                            <p>Admin perks program will appear here.</p>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div>
                        <h1 className="section-title">Settings</h1>
                        <div className="settings-content">
                            <p>Admin settings will appear here.</p>
                        </div>
                    </div>
                );
            case 'contacts':
                return (
                    <div>
                        <h1 className="section-title">Contacts</h1>
                        <div className="contacts-content">
                            <p>Admin contacts will appear here.</p>
                        </div>
                    </div>
                );
            case 'faq':
                return (
                    <div>
                        <h1 className="section-title">FAQ</h1>
                        <div className="faq-content">
                            <p>Admin FAQ will appear here.</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div>
                        <h1 className="section-title">Reservations</h1>
                        <div className="reservations-content">
                            <p>Admin reservations will appear here.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <LoadingScreen isLoading={isLoading || isSectionLoading} />
            <div style={{ display: 'flex', maxWidth: '1500px', margin: '0 auto' }}>
                <UnifiedHeader variant="white" userType="admin" isAuthenticated={true} />
                <NavigationPannel 
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
                <AdminDashboardStyle>
                    <div className={`section-container ${isAnimating ? 'animating' : ''}`}>
                        {renderSection()}
                    </div>
                </AdminDashboardStyle>
            </div>
        </>
    );
};

export default AdminDashboard; 