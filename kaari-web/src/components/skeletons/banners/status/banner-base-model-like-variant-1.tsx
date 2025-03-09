import { Theme } from "../../../../theme/theme";
import LikeBannerBaseModelVariant1 from "../../../styles/banners/status/banner-base-model-style-like-variant-1";
import { LikedIcon } from "../../icons/Liked-Icon";
import { useState } from "react";

interface Props {
  onClick?: () => void;
}

const LikeBannerBaseModelLikeVariant1: React.FC<Props> = ({ onClick }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
    onClick?.();
  };

  return (
    <LikeBannerBaseModelVariant1 isLiked={isLiked} onClick={handleClick}>
      <LikedIcon bgColor={isLiked ? Theme.colors.white : Theme.colors.secondary} />

    </LikeBannerBaseModelVariant1>

  );
};

export default LikeBannerBaseModelLikeVariant1;
