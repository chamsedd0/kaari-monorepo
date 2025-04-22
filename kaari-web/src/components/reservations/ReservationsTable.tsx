import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';

interface Reservation {
    propertyName: string;
    advertiser: string;
    checkIn: string;
    status: 'Pending' | 'Approved' | 'Declined';
    fee: string;
}

const ReservationsTableStyle = styled.div`
    width: 100%;
    padding: 24px;
    background: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    margin-top: 20px;

    h2 {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        margin-bottom: 24px;
    }

    .table-header {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1fr 1fr 0.5fr 0.5fr;
        padding: 12px 16px;
        border-bottom: 1px solid ${Theme.colors.gray};

        span {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.gray2};
        }
    }

    .table-row {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1fr 1fr 0.5fr 0.5fr;
        padding: 16px;
        align-items: center;
        border-bottom: 1px solid ${Theme.colors.gray};

        .property-name {
            font: ${Theme.typography.fonts.text16};
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
                font: ${Theme.typography.fonts.text14};
                color: ${Theme.colors.black};
            }
        }

        .check-in {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.gray2};
        }

        .status {
            padding: 4px 12px;
            border-radius: 16px;
            font: ${Theme.typography.fonts.smallB};
            width: fit-content;

            &.pending {
                background: ${Theme.colors.blue};
                color: ${Theme.colors.white};
            }

            &.approved {
                background: ${Theme.colors.success};
                color: ${Theme.colors.white};
            }

            &.declined {
                background: ${Theme.colors.error};
                color: ${Theme.colors.white};
            }
        }

        .fee {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.black};
        }

        .details-button {
            padding: 6px 12px;
            border: 1px solid ${Theme.colors.gray};
            border-radius: ${Theme.borders.radius.md};
            background: transparent;
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.black};
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background: ${Theme.colors.gray2};
            }
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
                        <img src="data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3e%3crect width='32' height='32' fill='%23cccccc'/%3e%3ctext x='50%25' y='50%25' font-family='sans-serif' font-size='8' text-anchor='middle' dominant-baseline='middle' fill='%23666666'%3eUser%3c/text%3e%3c/svg%3e" alt={reservation.advertiser} />
                        <span>{reservation.advertiser}</span>
                    </div>
                    <div className="check-in">{reservation.checkIn}</div>
                    <div className={`status ${reservation.status.toLowerCase()}`}>
                        {reservation.status}
                    </div>
                    <div className="fee">{reservation.fee}</div>
                    <button className="details-button">Details</button>
                </div>
            ))}
        </ReservationsTableStyle>
    );
}; 