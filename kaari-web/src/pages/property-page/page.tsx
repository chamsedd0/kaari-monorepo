import { useEffect, useRef, useState } from "react";
import { PropertyPage } from "./styles";
import { WhiteHeaderUsers } from "../../components/skeletons/constructed/headers/header-users-white";
import PhotoSlider from "../../components/skeletons/constructed/slider/photo-slider";

import pictures from '../../assets/images/propertyExamplePic.png'

const PropertyPageComponent = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(true);
  const [isStopped, setIsStopped] = useState(false);
  const [stopPosition, setStopPosition] = useState(0);

  const images = [pictures, pictures, pictures, pictures];

  useEffect(() => {
    const handleScroll = () => {
      if (!boxRef.current || !stopRef.current) return;

      const boxRect = boxRef.current.getBoundingClientRect();
      const stopRect = stopRef.current.getBoundingClientRect();

      if (stopRect.top <= boxRect.height + 100) {
        setIsStopped(true);
        setIsFixed(false);
        setStopPosition(window.scrollY + stopRect.top - boxRect.height);
      } else {
        setIsStopped(false);
        setIsFixed(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PropertyPage isFixed={isFixed} isStopped={isStopped} stopPosition={stopPosition}>
      <WhiteHeaderUsers user></WhiteHeaderUsers>
      {/* Main Content */}
      <div className="main-content">

            <div className="photo-slider">
                <PhotoSlider images={images}></PhotoSlider>
            </div>

      </div>

      {/* Checkout Box */}
      <div ref={boxRef} className={`checkout-box ${isFixed ? "fixed" : ""} ${isStopped ? "stopped" : ""}`}>
        
      </div>

      {/* Stop Point (Invisible) */}
      <div ref={stopRef} className="stop-point" />
    </PropertyPage>
  );
};

export default PropertyPageComponent;