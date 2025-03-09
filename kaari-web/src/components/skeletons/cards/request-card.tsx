import { CardBaseModelStyleRequest } from "../../styles/cards/card-base-model-style-request";
import ProgressBanner from "../banners/status/banner-base-model-progress";

export const RequestCard = ({
  title,
  image,
  name,
  type,
  price,
  status,
  progress
}: {
  title: string;
  image: string;
  name: string;
  type: string;
  price: string;
  status: string;
  progress: 'Pending' | 'Approved' | 'Declined';
}) => {
  return (
    <CardBaseModelStyleRequest>
      <div className="title">
        {title}
      </div>
      <img src={image} alt={title} />
      <div className="text">
        <div className="title">
          <b>{type}</b> {name}
        </div>
        <div className="price">
          {price}MAD monthly
        </div>
        <div className="description">
          {status}
        </div>
        <div className="progress">
          <ProgressBanner text={progress} status={progress} />
        </div>
      </div>
    </CardBaseModelStyleRequest>
  );
};
