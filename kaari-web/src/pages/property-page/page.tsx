import { useEffect, useRef, useState } from "react";
import { PropertyPage } from "./styles";
import { WhiteHeaderUsers } from "../../components/skeletons/constructed/headers/header-users-white";
import PhotoSlider from "../../components/skeletons/constructed/slider/photo-slider";

import pictures from '../../assets/images/propertyExamplePic.png'
import PropertyRequestCard from "../../components/skeletons/cards/send-request-card";
import ProfilePic from '../../assets/images/ProfilePicture.png'
import LivingRoom from '../../assets/images/livingRoomExample.png'


const PropertyPageComponent = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(true);
  const [isStopped, setIsStopped] = useState(false);
  const [stopPosition, setStopPosition] = useState(0);
  const [totalHeight, setTotalHeight] = useState(0);

  const images = [pictures, LivingRoom, pictures, pictures];

  useEffect(() => {
    

    const handleScroll = () => {
      setTotalHeight(document.documentElement.scrollHeight || document.body.scrollHeight);
      

      if (!boxRef.current || !stopRef.current) return;

      const boxRect = boxRef.current.getBoundingClientRect();
      const stopRect = stopRef.current.getBoundingClientRect();

      console.log(window.scrollY + stopRect.top)

      if (stopRect.top <= boxRect.height) {
        setIsStopped(true);
        setIsFixed(false);
        setStopPosition(window.scrollY + stopRect.top);
      } else {
        setIsStopped(false);
        setIsFixed(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PropertyPage total_Height={totalHeight} isFixed={isFixed} isStopped={isStopped} stopPosition={stopPosition}>
      <WhiteHeaderUsers user></WhiteHeaderUsers>
      {/* Main Content */}
      <div className="main-content">

            <div className="photo-slider">
                <PhotoSlider images={images}></PhotoSlider>
            </div>

      </div>

      <div ref={stopRef} className="stop-point" />
      

      {/* Checkout Box */}
      <div ref={boxRef} className={`checkout-box ${isFixed ? "fixed" : ""} ${isStopped ? "stopped" : ""}`}>
          <PropertyRequestCard
            title="Apartment - flat in the center of Agadir"
            isVerified={true}
            advertiserName="Leonardo V."
            advertiserImage={ProfilePic}
            moveInDate="21/08/2024"
            priceFor30Days={2000}
            serviceFee={400}
            totalPrice={2400}
          />
      </div>

    </PropertyPage>
  );
};

export default PropertyPageComponent;