import React, { useState } from 'react';
import { RecommendToFriendStyle } from './styles';
import BannerBg from './bannerBg.svg'
import InputBaseModel1 from '../../../../../../components/styles/inputs/input-fields/input-base-model-style-1';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import { useTranslation } from 'react-i18next';

const RecommendToFriend: React.FC = () => {
    const { t } = useTranslation();

    return (
        <RecommendToFriendStyle>
            <h1 className="title">{t('advertiser_dashboard.profile.recommend_friend.title')}</h1>
            <h2 className="secondary-title">
                {t('advertiser_dashboard.profile.recommend_friend.description', { amount: '100€' })}
            </h2>
            
            <p className="info-text">
                {t('advertiser_dashboard.profile.recommend_friend.description')}
            </p>
            
            <div className="input-container">
                <label className="input-label">{t('advertiser_dashboard.profile.recommend_friend.email_placeholder')}</label>
                <InputBaseModel1>
                    <input type="text" placeholder={t('advertiser_dashboard.profile.recommend_friend.email_placeholder')} />
                </InputBaseModel1>
            </div>
            
            <div className="button-container">
                <PurpleButtonMB48 text={t('advertiser_dashboard.profile.recommend_friend.save_button')} />
            </div>
            
            <div className="recommend-banner">
                <img src={BannerBg} alt={t('advertiser_dashboard.profile.recommend_friend.title')} />
                <div className="banner-content">
                    <h2>{t('advertiser_dashboard.profile.recommend_friend.banner_title', { amount: '100€' })}</h2>
                    <p>{t('advertiser_dashboard.profile.recommend_friend.banner_text', { amount: '100€' })}</p>
                </div>
            </div>
        </RecommendToFriendStyle>
    );
};

export default RecommendToFriend;
