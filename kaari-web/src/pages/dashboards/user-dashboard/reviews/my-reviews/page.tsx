import React from 'react';
import { MyReviewsPageStyle } from './styles';
import NeedHelpCardComponent from '../../../../../components/skeletons/cards/need-help-card';
import VerifyEmailCardComponent from '../../../../../components/skeletons/cards/verify-email-card';

const MyReviewsPage: React.FC = () => {
    return (
        <MyReviewsPageStyle>
            <div className="left">
                <div className="top-section">
                    <h1 className="page-title">My Reviews</h1>
                    <h2 className="section-title">Reviews You've Written</h2>
                    <p className="section-info">
                        View and manage all the reviews you've written for properties you've stayed at.
                    </p>
                </div>
                {/* Review list will go here */}
            </div>
            <div className="right">
                <VerifyEmailCardComponent />
                <NeedHelpCardComponent 
                    title="Need Help?" 
                    faqItems={[
                        {
                            question: "How do I edit my review?",
                            onClick: () => {}
                        },
                        {
                            question: "Why can't I see my review?",
                            onClick: () => {}
                        },
                        {
                            question: "How long do reviews stay visible?",
                            onClick: () => {}
                        }
                    ]} 
                />
            </div>
        </MyReviewsPageStyle>
    );
};

export default MyReviewsPage;
