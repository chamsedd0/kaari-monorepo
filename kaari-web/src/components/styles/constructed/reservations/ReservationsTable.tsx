import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { WhiteButtonSM32 } from '../../../skeletons/buttons/white_SM32';
import ProgressBanner from '../../../skeletons/banners/status/banner-base-model-progress';
import Pic from '../../../../assets/images/ProfilePicture.png';



interface Reservation {
    propertyName: string;
    advertiser: string;
    checkIn: string;
    status: 'Pending' | 'Approved' | 'Declined';
    fee: string;
}

const ReservationsTableStyle = styled.div`
    width: 100%;
    padding: 32px 20px;
    background: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.md};
    border: ${Theme.borders.primary};

    h2 {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        margin-bottom: 15px;
    }

    .table-header {
        display: grid;
        grid-template-columns: 1.5fr 1.5fr 1fr 1fr 0.5fr 0.5fr;
        padding: 17px 0px;
        border-bottom: ${Theme.borders.primary};

        span {
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.gray2};
        }
    }

    .table-row {
        display: grid;
        grid-template-columns: 1.5fr 1.5fr 1fr 1fr 0.5fr 0.5fr;
        padding: 17px 0px;
        align-items: center;
        border-bottom: ${Theme.borders.primary};

        .property-name {
            font: ${Theme.typography.fonts.smallB};
            color: ${Theme.colors.black};
        }

        .advertiser {
            display: flex;
            align-items: center;
            gap: 8px;

            img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
            }

            span {
                font: ${Theme.typography.fonts.smallB};
                color: ${Theme.colors.black};
            }
        }

        .check-in {
            font: ${Theme.typography.fonts.smallB};
            color: ${Theme.colors.gray2};
        }



        .fee {
            font: ${Theme.typography.fonts.smallB};
            color: ${Theme.colors.black};
        }


    }
`;

const mockData: Reservation[] = [
    {
        propertyName: "Apartment in Agadir",
        advertiser: "Leonardo V.",
        checkIn: "05.09.2024",
        status: "Pending",
        fee: "0$"
    },
    {
        propertyName: "Apartment in Agadir",
        advertiser: "Leonardo V.",
        checkIn: "05.09.2024",
        status: "Approved",
        fee: "0$"
    },
    {
        propertyName: "Apartment in Agadir",
        advertiser: "Leonardo V.",
        checkIn: "05.09.2024",
        status: "Declined",
        fee: "0$"
    },
    {
        propertyName: "Apartment in Agadir",
        advertiser: "Leonardo V.",
        checkIn: "05.09.2024",
        status: "Pending",
        fee: "0$"
    },
    {
        propertyName: "Apartment in Agadir",
        advertiser: "Leonardo V.",
        checkIn: "05.09.2024",
        status: "Declined",
        fee: "0$"
    },
    {
        propertyName: "Apartment in Agadir",
        advertiser: "Leonardo V.",
        checkIn: "05.09.2024",
        status: "Pending",
        fee: "0$"
    }
];

export const ReservationsTable: React.FC = () => {
    return (
        <ReservationsTableStyle>
            <h2>Other Reservations</h2>
            <div className="table-header">
                <span>Property Name</span>
                <span>Advertiser</span>
                <span>Check-in</span>
                <span>Status</span>
                <span>Fee</span>
                <span></span>
            </div>
            {mockData.map((reservation, index) => (
                <div key={index} className="table-row">
                    <div className="property-name">{reservation.propertyName}</div>
                    <div className="advertiser">
                        <img src={Pic} alt={reservation.advertiser} />
                        <span>{reservation.advertiser}</span>
                    </div>
                    <div className="check-in">{reservation.checkIn}</div>
                    <div className="status">
                        <ProgressBanner text={reservation.status} status={reservation.status} />
                    </div>
                    <div className="fee">{reservation.fee}</div>
                    <WhiteButtonSM32 text="Details" />
                </div>
            ))}
        </ReservationsTableStyle>
    );
}; 