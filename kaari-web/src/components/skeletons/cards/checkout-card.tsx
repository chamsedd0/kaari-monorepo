import { CardBaseModelStyleCheckout } from "../../styles/cards/card-base-model-style-checkout";
import infoIcon from "../icons/detailsIcon.svg";

export const CheckoutCard = ({
  title,
  image,
  moveInDate,
  lengthOfStay,
  profileImage,
  profileName,
  monthlyRent,
  securityDeposit,
  serviceFee,
  total,
  onViewProfile,
  onReadCancellationPolicy,

}: {
  title: string;
  image: string;
  moveInDate: string;
  lengthOfStay: string;
  profileImage: string;
  profileName: string;
  monthlyRent: string;
  securityDeposit: string;
  serviceFee: string;
  total: string;
  onViewProfile?: () => void;
  onReadCancellationPolicy?: () => void;

}) => {
  return (
    <CardBaseModelStyleCheckout>
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

      <div className="price-details">
        <div className="row first">
          Price Details
          <img src={infoIcon} alt='info' />
        </div>
        <div className="row">
          <b>Monthly Rent</b>
          <span>{monthlyRent}</span>
        </div>
        <div className="row">
          <b>Security Deposit</b>
          <span>{securityDeposit}</span>
        </div>
        <div className="row">
          <b>Service Fee</b>
          <span>{serviceFee}</span>
        </div>
        <div className="line-separator" />
        <div className="row total">
          In Total
          <span>{total}</span>
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
    </CardBaseModelStyleCheckout>
  );
};
