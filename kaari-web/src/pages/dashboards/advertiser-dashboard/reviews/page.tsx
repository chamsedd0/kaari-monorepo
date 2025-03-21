import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

const ReviewsPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;

  .reviews-title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 20px;
  }

  .reviews-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const ReviewsPage: React.FC = () => {
  return (
    <ReviewsPageStyle>
      <h2 className="reviews-title">Reviews</h2>
      <div className="reviews-content">
        <p>This is reviews page</p>
      </div>
    </ReviewsPageStyle>
  );
};

export default ReviewsPage;
