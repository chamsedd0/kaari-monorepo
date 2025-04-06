import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import StarIcon from '../icons/Icon-Star.svg';

interface StarRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    maxRating?: number;
}

const StarRatingContainer = styled.div`
    display: flex;
    gap: 4px;
    
    .star {
        cursor: pointer;
        transition: transform 0.1s ease;
        
        &:hover {
            transform: scale(1.1);
        }
        
        img {
            width: 24px;
            height: 24px;
            
            &.empty {
                opacity: 0.3;
            }
        }
    }
`;

const StarRating: React.FC<StarRatingProps> = ({ 
    rating, 
    onRatingChange, 
    maxRating = 5 
}) => {
    return (
        <StarRatingContainer>
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <div 
                        key={index} 
                        className="star"
                        onClick={() => onRatingChange(starValue)}
                    >
                        <img 
                            src={StarIcon} 
                            alt={`${starValue} star`}
                            className={starValue <= rating ? '' : 'empty'}
                        />
                    </div>
                );
            })}
        </StarRatingContainer>
    );
};

export default StarRating; 