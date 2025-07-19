import React from "react";
import { CardBaseModelStyleThinFreePhotoshoot } from "../../styles/cards/card-base-model-style-thin-free-photoshoot";
import CameraGirl from "../../../assets/icons/camera-girl.svg";
import {WhiteButtonLB48} from "../buttons/white_LB48"

interface ThinFreePhotoshootCardProps {
  onBookClick?: () => void;
}

const ThinFreePhotoshootCard: React.FC<ThinFreePhotoshootCardProps> = ({ onBookClick }) => {
  return (
    <CardBaseModelStyleThinFreePhotoshoot>
      <div className="text-container">
        <div className="text-16">List your property with our</div>
        <div className="h3-text">Free Photoshoot!</div>
      </div>
      <div className="image-container">
        <img src={CameraGirl} alt="Camera Girl" />
      </div>
      <div className="button-container">
        <WhiteButtonLB48 text="Book a Photoshoot" onClick={onBookClick} />
      </div>
    </CardBaseModelStyleThinFreePhotoshoot>
  );
};

export default ThinFreePhotoshootCard;
