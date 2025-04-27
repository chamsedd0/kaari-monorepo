import { FavouritesStyle } from "./styles";
import UnifiedHeader from "../../components/skeletons/constructed/headers/unified-header";
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
            <UnifiedHeader variant="white" userType="user" />

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
                    <PropertyCard 
                        id="prop1"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Apartment"
                        isFavorite={true}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="prop2"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="House"
                        isFavorite={true}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="prop3"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Villa"
                        isFavorite={true}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="prop4"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Apartment"
                        isFavorite={true}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="prop5"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="House"
                        isFavorite={true}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="prop6"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Villa"
                        isFavorite={true}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="prop7"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Apartment"
                        isFavorite={true}
                        onToggleFavorite={() => {}}
                    />
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
                    <PropertyCard 
                        id="sugg1"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="House"
                        isFavorite={false}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="sugg2"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Apartment"
                        isFavorite={false}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="sugg3"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Villa"
                        isFavorite={false}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="sugg4"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Condo"
                        isFavorite={false}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="sugg5"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="House"
                        isFavorite={false}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="sugg6"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Apartment"
                        isFavorite={false}
                        onToggleFavorite={() => {}}
                    />
                    <PropertyCard 
                        id="sugg7"
                        image={PropertyPic} 
                        title="Property Title" 
                        subtitle="Property Subtitle" 
                        description="Property Description" 
                        price="100" 
                        priceType="Night" 
                        minstay="1" 
                        isRecommended={false}
                        propertyType="Villa"
                        isFavorite={false}
                        onToggleFavorite={() => {}}
                    />
                </div>
            </div>
        </FavouritesStyle>
    )
}
