import React from 'react';
import { DashboardPageStyle } from './styles';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import UpcomingPhotoshoot from '../../../../components/skeletons/cards/upcoming-photoshoot';
import apartment from '../../../../assets/images/livingRoomExample.png' 
import profile from '../../../../assets/images/advertiser.png'
import LatestRequestDashboardCard from '../../../../components/skeletons/cards/lateest-request-dashboard-card';
import MessagesCard from '../../../../components/skeletons/cards/messages-card';
import BookAPhotoshootComponent from '../../../../components/skeletons/cards/book-a-photoshoot-card';
import PaymentCardComponent from '../../../../components/skeletons/cards/payment-card';
const DashboardPage: React.FC = () => {
  return (
    <DashboardPageStyle>
      <div className="left">
        <LatestRequestDashboardCard
        title="Latest Request"
        viewMoreText="View more"
        requestImage={apartment}
        requestTitle="Apartment - flat in the center of Agadir"
        photographerName="John Price "
        photographerInfo="John Price "
        photographerImage={profile}
        moveInDate="20/09/2024"
        aplliedon="20/09/2024"
        remainingTime="22h remaining"
        />
        <MessagesCard
        title="Messages"
        profilePicture={profile}
        name="John Price"
        messages="Hello! How many people will stay in this apartment? I will be requesting deposit before moving in. All other details.."
        />
      <UpcomingPhotoshoot
        number={1}  
        date="20/09/2024 6:00 PM"
        time="01:15:44:23"
        photographerName="Derek Xavier "
        photographerInfo="Kaari Photography Agent "
        photographerImage={profile}
        location="123 Main Street, Apartment 4B"
      />
      </div>
      <div className="right">
        <BookAPhotoshootComponent/>

        <PaymentCardComponent 
        incomeAmount="3000$" 
        incomeText="This month’s income" 
        infoItems={[{title: "Tenants", number: "3"}, {title: "April", number: "1500$"},{title: "Total", number: "1500$"}]} />
        <NeedHelpCardComponent />
      </div>
    </DashboardPageStyle>
  );
};

export default DashboardPage;
