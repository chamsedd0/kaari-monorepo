import { useState, MouseEvent, useRef, useEffect } from "react";
import { PhotoSliderStyle } from "../../../styles/constructed/slider/photo-slider-style";
import ArrowLeft from '../../icons/Icon_Arrow_Left.svg'
import ArrowRight from '../../icons/Icon_Arrow_Right.svg'
import PlayIcon from '../../icons/Icon_Play.svg' // Assuming you have a play icon, if not we'll handle it

interface PhotoSliderProps {
    images: string[];
    videos?: string[];
}

const PhotoSlider = ({ images, videos = [] }: PhotoSliderProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    
    // Combine videos and images for the slider
    const allMedia = [...videos, ...images];
    const isVideo = (index: number) => index < videos.length;
    
    useEffect(() => {
        // Reset video refs array when videos change
        videoRefs.current = videoRefs.current.slice(0, videos.length);
    }, [videos]);
    
    const nextItem = () => {
        // Pause current video if it's playing
        if (isVideo(selectedIndex) && videoRefs.current[selectedIndex]) {
            videoRefs.current[selectedIndex]?.pause();
        }
        setSelectedIndex((prev) => (prev + 1) % allMedia.length);
    };

    const prevItem = () => {
        // Pause current video if it's playing
        if (isVideo(selectedIndex) && videoRefs.current[selectedIndex]) {
            videoRefs.current[selectedIndex]?.pause();
        }
        setSelectedIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
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
    
    const handleItemClick = (index: number) => {
        // Pause current video if it's playing
        if (isVideo(selectedIndex) && videoRefs.current[selectedIndex]) {
            videoRefs.current[selectedIndex]?.pause();
        }
        setSelectedIndex(index);
    };

    return (
        <PhotoSliderStyle>
            <div className="main-image-container">
                <button className="nav-button prev" onClick={prevItem}>
                    <img src={ArrowLeft} alt="Previous" />
                </button>
                <div className="main-image-wrapper">
                    {allMedia.map((mediaUrl, index) => (
                        isVideo(index) ? (
                            <div 
                                key={`video-${index}`}
                                className={`video-container ${selectedIndex === index ? 'active' : ''}`}
                            >
                                <video
                                    ref={el => { videoRefs.current[index] = el; }}
                                    src={mediaUrl}
                                    controls
                                    className="main-video"
                                    poster={mediaUrl + '?poster=true'} // Optional: add poster parameter if your backend supports it
                                />
                            </div>
                        ) : (
                            <img
                                key={`image-${index}`}
                                src={mediaUrl}
                                alt={`Property view ${index + 1 - videos.length}`}
                                className={`main-image ${selectedIndex === index ? 'active' : ''}`}
                            />
                        )
                    ))}
                </div>
                <button className="nav-button next" onClick={nextItem}>
                    <img src={ArrowRight} alt="Next" />
                </button>
            </div>

            <div 
                className="thumbnails-container"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {allMedia.map((mediaUrl, index) => (
                    isVideo(index) ? (
                        <div 
                            key={`video-thumb-${index}`}
                            className={`thumbnail-container ${selectedIndex === index ? 'active' : ''}`}
                            onClick={() => handleItemClick(index)}
                        >
                            <div className="video-thumbnail">
                                <div className="play-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                                    </svg>
                                </div>
                                <img 
                                    src={mediaUrl + '?thumbnail=true'} // Optional: add thumbnail parameter if your backend supports it
                                    alt={`Video ${index + 1}`}
                                    className="thumbnail"
                                    draggable="false"
                                />
                            </div>
                        </div>
                    ) : (
                        <img
                            key={`image-thumb-${index}`}
                            src={mediaUrl}
                            alt={`Property view ${index + 1 - videos.length}`}
                            className={`thumbnail ${selectedIndex === index ? 'active' : ''}`}
                            onClick={() => handleItemClick(index)}
                            draggable="false"
                        />
                    )
                ))}
            </div>
        </PhotoSliderStyle>
    );
};

export default PhotoSlider;