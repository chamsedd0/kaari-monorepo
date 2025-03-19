import { WriteReviewCard } from "../../styles/cards/card-base-model-style-reviews-write";
import Picture from "../../../assets/images/propertyExamplePic.png" ;
import { PurpleButtonMB48 } from "../buttons/purple_MB48";


interface ReviewsWriteSkeletonProps {
    title?: string;
    moveInDate?: string;
    advertiserName?: string;
    propertyImage?: string;
}

const ReviewsWriteSkeleton = ({ 
    title, 
    moveInDate, 
    advertiserName, 
    propertyImage 
}: ReviewsWriteSkeletonProps) => {
    return (
        <WriteReviewCard>
            <div className="info-text">Reviews are written after maximum 1 month after move-in date</div>
            <div className="container">
                <div className="container-left">
                    <img src={propertyImage || Picture} alt="Property" />
                    <div className="container-left-content">
                        <div className="title">{title || "Modern Apartment in Agadir"}</div>
                        <div className="subtitle">Move-in date {moveInDate || "05.09.2024"}</div>

                        <div className="advertiser-profile">
                            <div className="advertiser-name">Advertiser: <b>{advertiserName || "Leonardo V."}</b></div>
                            <button className="advertiser-profile-button">
                                View profile
                            </button>
                        </div>

                    </div>
                </div>

                <div className="container-right">

                    <button className="advertiser-profile-button feedback-button">
                        Write private Feedback to Kaari
                    </button>

                    <div className="write-review-button">
                        <PurpleButtonMB48 text="Write Feedback" />
                    </div>

                </div>
            </div>
        </WriteReviewCard>
    );
};

export default ReviewsWriteSkeleton;
