
import BookingSearchForm from "./components/skeletons/constructed/forms/booking-search-form";
import LandingPage from "./landing-page-style";
import Arrow from './components/skeletons/icons/ArrowLeft.svg'
import ArrowThick from './components/skeletons/icons/ArrowRightThick.svg'

import bg_pic from './assets/images/HeroImage.png'
import PurpleWaves from './assets/images/purpleWaves.svg'
import DescriptionText_Icon from "./components/skeletons/banners/text/description-text-icon";

import icon1 from './components/skeletons/icons/Security.svg'
import icon2 from './components/skeletons/icons/Identity.svg'
import icon3 from './components/skeletons/icons/Quality.svg'
import icon4 from './components/skeletons/icons/Price.svg'

import { PurpleButtonLB60 } from "./components/skeletons/buttons/purple_LB60";

function App() {

  return (
    <LandingPage>
      <div className="search-section">
        <img src={bg_pic} alt="" className="bg-img" />
        <div className="title">
          Trustworthy, verified rentals
        </div>
        <div className="form-container">
          <BookingSearchForm />
        </div>
        <div className="explore-link">Find Places here <img src={Arrow} alt="->"/></div>
          <div className="bottom-banner">
              <div className="up-sell-for-owners">
                Own a place? Try Hosting
              <img src={ArrowThick} alt="->"/>
          </div>
        </div>
      </div>

      <div className="description-section">
        <DescriptionText_Icon icon={icon1}text="Experience enhanced tenant security with our comprehensive Renter Protection policy. "></DescriptionText_Icon>

        <DescriptionText_Icon icon={icon2} text="Each property listed on our site undergoes thorough in-person inspections to ensure accuracy and reliability."></DescriptionText_Icon>

        <DescriptionText_Icon icon={icon3} text="We offer top-notch photos, videos, floor plans, and more to help you make informed decisions."></DescriptionText_Icon>

        <DescriptionText_Icon icon={icon4} text="The prices you see are final ... no hidden charges. Everything is clearly communicated upfront."></DescriptionText_Icon>

        
      </div>

      <div className="mission-statment-section">
        <img src={PurpleWaves} alt="" className="bg-img" />
        <div className="what-is-kaari">
          <div className="title">What is Kaari?</div>
          <div className="subtitle">Choose your type, based on your needs</div>
          <div className="buttons">
              <PurpleButtonLB60 text={'For Guests'}></PurpleButtonLB60>
              <PurpleButtonLB60 text={'For Hosts'}></PurpleButtonLB60>
          </div>
        </div>
        <div className="mission-blocks">
          
        </div>
      </div>
    </LandingPage>
  )
}

export default App;