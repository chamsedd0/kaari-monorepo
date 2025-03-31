import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

const RecommendToFriendStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;

    .section-title {
        font: ${Theme.typography.fonts.h2};
        color: ${Theme.colors.black};
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
`;

const RecommendToFriendPage: React.FC = () => {
    return (
        <RecommendToFriendStyle>
            <h1 className="section-title">Recommend to Friend</h1>
            <div className="content">
                {/* Content will be added here */}
            </div>
        </RecommendToFriendStyle>
    );
};

export default RecommendToFriendPage;
