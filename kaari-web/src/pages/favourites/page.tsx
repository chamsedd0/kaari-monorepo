import { FavouritesStyle } from "./styles";
import { WhiteHeaderUsers } from "../../components/skeletons/constructed/headers/header-users-white";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import PropertyPic from "../../assets/images/propertyExamplePic.png";
import { useRef } from "react";
import LeftArrow from "../../components/skeletons/icons/Icon_Arrow_Left.svg";
import RightArrow from "../../components/skeletons/icons/Icon_Arrow_Right.svg";

export const FavouritesPage = () => {
    const favouritesRef = useRef<HTMLDivElement>(null);
    const suggestedRef = useRef<HTMLDivElement>(null);
    
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
        <FavouritesStyle>
            <WhiteHeaderUsers user></WhiteHeaderUsers>

            <div className="favourites-container">
                <div className="section-header">
                    <h2 className="favourites-title">Favorites</h2>
                    <div className="navigation-buttons">
                        <button onClick={() => scroll('left', favouritesRef)}>
                            <img src={LeftArrow} alt="Left Arrow" />
                        </button>
                        <button onClick={() => scroll('right', favouritesRef)}>
                            <img src={RightArrow} alt="Right Arrow" />
                        </button>
                    </div>
                </div>
                <div className="favourites-list" ref={favouritesRef}>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                </div>
            </div>

            <div className="suggested-container">
                <div className="section-header">
                    <h3 className="suggested-title">Suggested</h3>
                    <div className="navigation-buttons">
                        <button onClick={() => scroll('left', suggestedRef)}>
                            <img src={LeftArrow} alt="Left Arrow" />
                        </button>
                        <button onClick={() => scroll('right', suggestedRef)}>
                            <img src={RightArrow} alt="Right Arrow" />
                        </button>
                    </div>
                </div>
                <div className="suggested-list" ref={suggestedRef}>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                    <PropertyCard image={PropertyPic} title="Property Title" subtitle="Property Subtitle" description="Property Description" price="100" priceType="Night" minstay="1" isRecommended={false}></PropertyCard>
                </div>
            </div>
        </FavouritesStyle>
    )
}
