
import { CardBaseModelStyle1 } from "../../styles/cards/card-base-model-style-1";
import { CertificationBanner } from "../banners/static/certification-banner";
import LikeBannerBaseModelLikeVariant2 from "../banners/status/banner-base-model-like-variant-2";

export const PropertyCard = ({image, title, subtitle, price, minstay, priceType, description, isRecommended}: {title: string, subtitle: string, price: string, priceType: string, minstay: string, description: string, isRecommended: boolean, image: string}) => {
  return (
    <CardBaseModelStyle1 isRecommended={isRecommended}>
        <div className="image">
            <img src={image} alt="Property" />
            <div className="certifications">
                <CertificationBanner purple text='Kaari Verified'></CertificationBanner>
                <CertificationBanner text='Tenants Protection'></CertificationBanner>
            </div>
        </div>
        <div className="title">
            <b>{title}</b>
            <span>{subtitle}</span>
        </div>  
        <div className="subtitle">
            {minstay}
        </div>
        <div className="price">
            {price} <b>{priceType}</b>
        </div>
        <div className="description">
            {description}
        </div>
        <div className="recommendedBanner">
            <div className="icon">
                <LikeBannerBaseModelLikeVariant2></LikeBannerBaseModelLikeVariant2>
            </div>
        </div>
    </CardBaseModelStyle1>
  );
};
