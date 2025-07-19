import React from "react";
import { CardBaseModelStyleSincePass } from "../../styles/cards/card-base-model-style-Since-Pass";

interface SincePassCardProps {
  listingsCurrent: number;
  listingsTotal: number;
  bookingsCurrent: number;
  bookingsTotal: number;
  listingsLabel?: string;
  bookingsLabel?: string;
}

export const SincePassCard: React.FC<SincePassCardProps> = ({
  listingsCurrent,
  listingsTotal,
  bookingsCurrent,
  bookingsTotal,
  listingsLabel = "Listings Since Pass",
  bookingsLabel = "Bookings Since Pass"
}) => {
  return (
    <CardBaseModelStyleSincePass>
      <div className="container">
        <span className="title-text">{listingsLabel}</span>
        <span className="number-text">{listingsCurrent}/{listingsTotal}</span>
      </div>
      <div className="container">
        <span className="title-text">{bookingsLabel}</span>
        <span className="number-text">{bookingsCurrent}/{bookingsTotal}</span>
      </div>
    </CardBaseModelStyleSincePass>
  );
};

export default SincePassCard;
