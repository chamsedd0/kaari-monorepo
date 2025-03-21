import React from 'react';
import { PropertiesPageStyle } from './styles';
import PropertyCardAdvertiserSide from '../../../../components/skeletons/cards/property-card-advertiser-side';
import picture from '../../../../assets/images/propertyExamplePic.png'

const PropertiesPage: React.FC = () => {
    return (
        <PropertiesPageStyle>
            <div className="properties-section">
                <h2 className="properties-section-title">Properties</h2>
                
                <div className="my-properties">
                    <h3 className="title">My listed properties</h3>
                    <div className="properties-group">
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
                    <h3 className="title">My unlisted properties</h3>
                    <div className="properties-group">
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

