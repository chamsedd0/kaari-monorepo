import { useState, MouseEvent } from "react";
import { PhotoSliderStyle } from "../../../styles/constructed/slider/photo-slider-style";
import ArrowLeft from '../../icons/Icon_Arrow_Left.svg'
import ArrowRight from '../../icons/Icon_Arrow_Right.svg'

const PhotoSlider = ({images}: {images: string[]}) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    
    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.pageX - e.currentTarget.offsetLeft);
        setScrollLeft(e.currentTarget.scrollLeft);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - e.currentTarget.offsetLeft;
        const walk = (x - startX) * 2;
        e.currentTarget.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <PhotoSliderStyle>
            <div className="main-image-container">
                <button className="nav-button prev" onClick={prevImage}>
                    <img src={ArrowLeft} alt="arrow-left" />
                </button>
                <div className="main-image-wrapper">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Property view ${index + 1}`}
                            className={`main-image ${selectedImage === index ? 'active' : ''}`}
                        />
                    ))}
                </div>
                <button className="nav-button next" onClick={nextImage}>
                    <img src={ArrowRight} alt="arrow-right" />
                </button>
            </div>

            <div 
                className="thumbnails-container"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Property view ${index + 1}`}
                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                        draggable="false"
                    />
                ))}
            </div>
        </PhotoSliderStyle>
    );
};

export default PhotoSlider;