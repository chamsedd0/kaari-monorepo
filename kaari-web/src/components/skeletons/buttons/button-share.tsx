import ShareButtonBaseModel from "../../styles/buttons/button-base-model-share-button";
import ShareIcon from '../icons/Icon-Share.svg'

interface Props {
  onClick?: () => void;
}

const ShareButton: React.FC<Props> = ({ onClick }) => {
  return (
    <ShareButtonBaseModel onClick={onClick}>
      <img src={ShareIcon} alt="Share" />
    </ShareButtonBaseModel>
  );
};

export default ShareButton;
