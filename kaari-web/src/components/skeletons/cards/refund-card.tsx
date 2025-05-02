import React from 'react';
import { Theme } from "../../../theme/theme";
import styled from "styled-components";
import infoIcon from "../icons/detailsIcon.svg";

// Create a styled component for the refund card
const CardBaseModelStyleRefund = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 600px;
    max-width: 100%;
    overflow: hidden;
    
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    background-color: ${Theme.colors.white};
    width: 100%;
    box-shadow: none;
    transition: transform 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
    }

    img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .container {
        width: 100%;    
        padding: 20px;
        padding-top: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 16px;

        .text {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;
            color: ${Theme.colors.black};
            text-align: start;
            gap: 8px;
            width: 100%;

            .title {
                font: ${Theme.typography.fonts.h4B};
                width: 100%;
                color: ${Theme.colors.black};
            }

            .move-in-date {
                font: ${Theme.typography.fonts.mediumM};
                width: 100%;
                color: ${Theme.colors.gray2};
            }

            .length-of-stay {
                font: ${Theme.typography.fonts.mediumM};
                width: 100%;
                color: ${Theme.colors.gray2};
            }
        }

        .profile-show-case {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin: 8px 0;
            padding: 12px 0;
            border-top: 1px solid ${Theme.colors.tertiary};
            border-bottom: 1px solid ${Theme.colors.tertiary};

            .profile-info {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;

                img {
                    width: 32px;
                    height: 32px;
                    object-fit: cover;
                    border-radius: 50%;
                }

                .profile-name {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
                }
            }
        }

        .refund-details {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;
            gap: 12px;
            width: 100%;
            margin-top: 16px;

            .first {   
                font: ${Theme.typography.fonts.largeB} !important;
                color: ${Theme.colors.black};
                margin-bottom: 4px;

                img {
                    width: 16px;
                    height: 16px;
                    margin-left: 8px;
                }
            }

            .row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.black}; 
                
                b {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                }

                span {
                    font: ${Theme.typography.fonts.mediumB};
                    color: ${Theme.colors.black};
                }
            }

            .line-separator {
                width: 100%;
                height: 1px;
                background-color: ${Theme.colors.tertiary};
                margin: 4px 0;
            }

            .total {
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.black};

                span {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.secondary};
                }
            }
        }

        .actions {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
            gap: 8px;
            padding: 8px 0;
            width: 100%;
            margin-top: 16px;

            .cancellation-policy {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.black};
            }
        }

        .button {
            background-color: transparent;
            color: ${Theme.colors.secondary};
            font: ${Theme.typography.fonts.link14};
            border: none;
            cursor: pointer;
            text-decoration: underline;
            transition: all 0.3s ease;
            padding: 0;
            text-align: left;

            &:hover {
                color: ${Theme.colors.primary};
            }
        }
    }
`;

export const RefundCard = ({
  title,
  image,
  moveInDate,
  lengthOfStay,
  profileImage,
  profileName,
  originalAmount,
  serviceFee,
  cancellationFee,
  refundTotal,
  daysToMoveIn,
  onViewProfile,
  onReadCancellationPolicy,
}: {
  title: string;
  image: string;
  moveInDate: string;
  lengthOfStay: string;
  profileImage: string;
  profileName: string;
  originalAmount: string;
  serviceFee: string;
  cancellationFee: string;
  refundTotal: string;
  daysToMoveIn: number; // Days remaining until move-in date
  onViewProfile?: () => void;
  onReadCancellationPolicy?: () => void;
}) => {
  
  return (
    <CardBaseModelStyleRefund>
      <img src={image} alt={title} />
      <div className="container">
        <div className="text">
          <div className="title">{title}</div>
          <div className="move-in-date">Move-in date: {moveInDate}</div>
          <div className="length-of-stay">Length of stay: {lengthOfStay}</div>
        </div>

        <div className="profile-show-case">
          <div className="profile-info">
            <img src={profileImage} alt={profileName} />
            <div className="profile-name">{profileName}</div>
          </div>
          <div className="profile-actions">
            <button className="button" onClick={onViewProfile}>
              View Profile
            </button>
          </div>
        </div>

        <div className="refund-details">
          <div className="row first">
            Total when accepted
            <img src={infoIcon} alt='info' />
          </div>
          <div className="row">
            <b>Rent refund</b>
            <span>{originalAmount}</span>
          </div>
          <div className="row">
            <b>Service fee</b>
            <span>-{serviceFee}</span>
          </div>
          <div className="row">
            <b>Cancellation fee</b>
            <span>-{cancellationFee}</span>
          </div>
          <div className="line-separator" />
          <div className="row total">
            Total Refund
            <span>{refundTotal}</span>
          </div>
        </div>

        <div className="actions">
          <div className="cancellation-policy">
            Cancellation Policy for Tenants
          </div>
          <button className="button" onClick={onReadCancellationPolicy}>
            Read More
          </button>
        </div>
      </div>
    </CardBaseModelStyleRefund>
  );
};
