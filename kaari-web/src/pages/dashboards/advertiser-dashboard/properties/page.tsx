import React, { useRef } from 'react';
import { PropertiesPageStyle } from './styles';
import PropertyCardAdvertiserSide from '../../../../components/skeletons/cards/property-card-advertiser-side';
import picture from '../../../../assets/images/propertyExamplePic.png';
import LeftArrow from '../../../../components/skeletons/icons/Icon_Arrow_Left.svg';
import RightArrow from '../../../../components/skeletons/icons/Icon_Arrow_Right.svg';

const PropertiesPage: React.FC = () => {
    const listedPropertiesRef = useRef<HTMLDivElement>(null);
    const unlistedPropertiesRef = useRef<HTMLDivElement>(null);
    
    const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return;
        const scrollAmount = 300;
        const newScrollLeft = direction === 'left' 
            ? ref.current.scrollLeft - scrollAmount 
            : ref.current.scrollLeft + scrollAmount;
        
        ref.current.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    return (
        <PropertiesPageStyle>
            <div className="properties-section">
                <h2 className="properties-section-title">Properties</h2>
                
                <div className="my-properties">
                    <div className="section-header">
                        <h3 className="title">My listed properties</h3>
                        <div className="navigation-buttons">
                            <button onClick={() => scroll('left', listedPropertiesRef)}>
                                <img src={LeftArrow} alt="Left Arrow" />
                            </button>
                            <button onClick={() => scroll('right', listedPropertiesRef)}>
                                <img src={RightArrow} alt="Right Arrow" />
                            </button>
                        </div>
                    </div>
                    <div className="properties-group" ref={listedPropertiesRef}>
                        <PropertyCardAdvertiserSide 
                            title="Property Name"
                            location="Location"
                            imageUrl={picture}
                            minStay="1 month"
                        />
                        <PropertyCardAdvertiserSide 
                            title="Property Name"
                            location="Location"
                            imageUrl={picture}
                            minStay="1 month"
                        />
                        <PropertyCardAdvertiserSide 
                            title="Property Name"
                            location="Location"
                            imageUrl={picture}
                            minStay="1 month"
                        />
                        <PropertyCardAdvertiserSide 
                            title="Property Name"
                            location="Location"
                            imageUrl={picture}
                            minStay="1 month"
                        />
                    </div>
                </div>
                <div className="my-properties">
                    <div className="section-header">
                        <h3 className="title">My unlisted properties</h3>
                        <div className="navigation-buttons">
                            <button onClick={() => scroll('left', unlistedPropertiesRef)}>
                                <img src={LeftArrow} alt="Left Arrow" />
                            </button>
                            <button onClick={() => scroll('right', unlistedPropertiesRef)}>
                                <img src={RightArrow} alt="Right Arrow" />
                            </button>
                        </div>
                    </div>
                    <div className="properties-group" ref={unlistedPropertiesRef}>
                        <PropertyCardAdvertiserSide 
                            title="Property Name"
                            location="Location"
                            imageUrl={picture}
                            minStay="1 month"
                        />
                        <PropertyCardAdvertiserSide 
                            title="Property Name"
                            location="Location"
                            imageUrl={picture}
                            minStay="1 month"
                        />
                        <PropertyCardAdvertiserSide 
                            title="Property Name"
                            location="Location"
                            imageUrl={picture}
                            minStay="1 month"
                        />
                        <PropertyCardAdvertiserSide 
                            title="Property Name"
                            location="Location"
                            imageUrl={picture}
                            minStay="1 month"
                        />
                    </div>
                </div>
            </div>
        </PropertiesPageStyle>
    );
};

export default PropertiesPage;

