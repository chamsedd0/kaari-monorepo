import { Theme } from "../../../../theme/theme";
import LikeBannerBaseModelVariant2 from "../../../styles/banners/status/banner-base-model-style-like-variant-2";
import { LikedWithBorder } from "../../icons/Liked-Icon-Border";
import { useState } from "react";

interface Props {
  onClick?: () => void;
}

const LikeBannerBaseModelLikeVariant2: React.FC<Props> = ({ onClick }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
    onClick?.();
  };

  return (
    <LikeBannerBaseModelVariant2 isLiked={isLiked} onClick={handleClick}>
      <LikedWithBorder bgColor={isLiked ? Theme.colors.error : 'transparent'}/>
    </LikeBannerBaseModelVariant2>
  );
};

export default LikeBannerBaseModelLikeVariant2;
