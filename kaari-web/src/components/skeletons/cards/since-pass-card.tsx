import React from "react";
import { CardBaseModelStyleSincePass } from "../../styles/cards/card-base-model-style-Since-Pass";

interface SincePassCardProps {
  listingsCurrent: number;
  listingsTotal: number;
  bookingsCurrent: number;
  bookingsTotal: number;
}

export const SincePassCard: React.FC<SincePassCardProps> = ({
  listingsCurrent,
  listingsTotal,
  bookingsCurrent,
  bookingsTotal,
}) => {
  return (
    <CardBaseModelStyleSincePass>
      <div className="container">
        <span className="title-text">Listings Since Pass</span>
        <span className="number-text">{listingsCurrent}/{listingsTotal}</span>
      </div>
      <div className="container">
        <span className="title-text">Bookings Since Pass</span>
        <span className="number-text">{bookingsCurrent}/{bookingsTotal}</span>
      </div>
    </CardBaseModelStyleSincePass>
  );
};

export default SincePassCard;
