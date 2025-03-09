import { useState } from "react";
import { PhotoSliderStyle } from "../../../styles/constructed/slider/photo-slider-style";




const PhotoSlider = ({images}: {images: string[]}) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
  
    return (

        <PhotoSliderStyle>

        </PhotoSliderStyle>
      
    );
  };
  
  export default PhotoSlider;