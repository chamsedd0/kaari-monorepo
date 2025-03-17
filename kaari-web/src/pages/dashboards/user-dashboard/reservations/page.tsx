import React from 'react';
import LatestRequestCard from '../../../../components/skeletons/cards/latest-request-card';
import { ReservationsTable } from '../../../../components/styles/constructed/reservations/ReservationsTable';
import Pic1 from '../../../../assets/images/Photoshoot3.png';
import Pic2 from '../../../../assets/images/Photoshoot4.png';
import { ReservationsStyle } from './styles';

const ReservationsPage: React.FC = () => {
    return (
        <ReservationsStyle>
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
                        image={Pic1} 
                    />
                </div>
                <div className="request-card">
                    <LatestRequestCard 
                        title="Latest Request 2" 
                        status="Approved" 
                        price="1000 per Night" 
                        date='11.12.2024'  
                        details="flat in the center of Agadir" 
                        image={Pic2}
                    />
                </div>
            </div>

            <ReservationsTable />
        </ReservationsStyle>
    );
};

export default ReservationsPage;
