import React from 'react';
import { ReviewsPageStyle } from './styles';
import ReviewCard from '../../../../components/skeletons/cards/review-card';
import SelectFieldBaseModelVariant2 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';
import { useTranslation } from 'react-i18next';

const ReviewsPage: React.FC = () => {
    const { t } = useTranslation();
    
    return (
        <ReviewsPageStyle>
            <h1 className="reviews-title">{t('advertiser_dashboard.reviews.title')}</h1>
            <div className="reviews-select-container">
                <SelectFieldBaseModelVariant2
                    placeholder={t('advertiser_dashboard.reviews.select_status')}   
                    options={[
                      t('advertiser_dashboard.reviews.status_all'), 
                      t('advertiser_dashboard.reviews.status_pending'), 
                      t('advertiser_dashboard.reviews.status_approved'), 
                      t('advertiser_dashboard.reviews.status_rejected')
                    ]}
                />
            </div>
          <ReviewCard 
              propertyTitle={t('advertiser_dashboard.reviews.property_example_1')}
              postedDate={t('advertiser_dashboard.reviews.date_example_1')}
              lengthOfStay={t('advertiser_dashboard.reviews.stay_duration_1')}
              reviewText={t('advertiser_dashboard.reviews.review_text_1')}
              advertiserName={t('advertiser_dashboard.reviews.reviewer_name_1')}
              ratings={[
                  { category: t('advertiser_dashboard.reviews.rating_communication'), score: 4 },
                  { category: t('advertiser_dashboard.reviews.rating_accuracy'), score: 5 },
                  { category: t('advertiser_dashboard.reviews.rating_location'), score: 5 },
                  { category: t('advertiser_dashboard.reviews.rating_value'), score: 4 }
              ]}
          />
          <ReviewCard 
              propertyTitle={t('advertiser_dashboard.reviews.property_example_2')}
              postedDate={t('advertiser_dashboard.reviews.date_example_2')}
              lengthOfStay={t('advertiser_dashboard.reviews.stay_duration_2')}
              reviewText={t('advertiser_dashboard.reviews.review_text_2')}
              advertiserName={t('advertiser_dashboard.reviews.reviewer_name_2')}
              ratings={[
                  { category: t('advertiser_dashboard.reviews.rating_communication'), score: 5 },
                  { category: t('advertiser_dashboard.reviews.rating_accuracy'), score: 4 },
                  { category: t('advertiser_dashboard.reviews.rating_location'), score: 5 },
                  { category: t('advertiser_dashboard.reviews.rating_value'), score: 4 }
              ]}
          />
      </ReviewsPageStyle>
    );
};

export default ReviewsPage;
